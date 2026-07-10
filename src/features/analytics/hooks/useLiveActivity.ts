import { useEffect, useState, useRef, useCallback } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { env } from "@/config/env";
import { AuthStorage } from "@/lib/auth/auth-storage";
import { LiveActivityService } from "@/services/liveActivity.service";
import { components } from "@/generated/openapi";

type LiveActivityResponse = components["schemas"]["LiveActivityResponse"];

export type StreamStatus = "CONNECTING" | "CONNECTED" | "RECONNECTING" | "DISCONNECTED" | "ERROR";

export function useLiveActivity(projectId: number) {
  const [activities, setActivities] = useState<LiveActivityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("DISCONNECTED");

  // Keep a ref of the current projectId to prevent stale callbacks/responses
  const projectIdRef = useRef<number>(projectId);
  // Keep track of active AbortController
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reconnection backoff counters
  const retryCountRef = useRef<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Shared time updater ticker
  const [timeTicker, setTimeTicker] = useState<number>(0);

  // Pure merge helper
  const mergeActivities = useCallback((
    existing: LiveActivityResponse[],
    incoming: LiveActivityResponse[]
  ): LiveActivityResponse[] => {
    const map = new Map<string, LiveActivityResponse>();
    // Insert existing ones first
    existing.forEach((act) => {
      if (act.activityId) map.set(act.activityId, act);
    });
    // Overwrite or add incoming ones
    incoming.forEach((act) => {
      if (act.activityId) map.set(act.activityId, act);
    });

    return Array.from(map.values())
      .sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 50);
  }, []);

  // Fetch REST history
  const fetchHistory = useCallback(async (pid: number) => {
    try {
      const data = await LiveActivityService.getRecentActivity(pid, 20);
      if (projectIdRef.current !== pid) return; // Stale request protection
      setActivities((prev) => mergeActivities(prev, data));
      setIsLoading(false);
      setIsError(false);
      setError(null);
    } catch (err: any) {
      if (projectIdRef.current !== pid) return;
      setIsLoading(false);
      setIsError(true);
      setError(err);
    }
  }, [mergeActivities]);

  // Connect to SSE Stream
  const connectStream = useCallback((pid: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const ctrl = new AbortController();
    abortControllerRef.current = ctrl;

    const token = AuthStorage.getAccessToken();
    const url = `${env.apiBaseUrl}/live-activity/stream?projectId=${pid}`;

    setStreamStatus(retryCountRef.current > 0 ? "RECONNECTING" : "CONNECTING");

    fetchEventSource(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: ctrl.signal,
      openWhenHidden: true,
      async onopen(response) {
        if (projectIdRef.current !== pid) return;
        if (response.ok) {
          setStreamStatus("CONNECTED");
          retryCountRef.current = 0; // Reset retry counter
          // Fetch REST history immediately on successful connection/reconnection
          fetchHistory(pid);
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // Non-retryable error
          setStreamStatus("ERROR");
          ctrl.abort();
        } else {
          // Retryable error
          throw new Error(`Server returned status: ${response.status}`);
        }
      },
      onmessage(event) {
        if (projectIdRef.current !== pid) return;
        if (event.event === "connected") {
          setStreamStatus("CONNECTED");
        } else if (event.event === "activity") {
          try {
            const data: LiveActivityResponse = JSON.parse(event.data);
            if (data.activityId && data.projectId === pid) {
              setActivities((prev) => mergeActivities(prev, [data]));
            }
          } catch (e) {
            console.error("Malformed SSE activity payload", e);
          }
        }
      },
      onclose() {
        if (projectIdRef.current !== pid) return;
        setStreamStatus("DISCONNECTED");
        scheduleReconnect(pid);
      },
      onerror(err) {
        if (projectIdRef.current !== pid) return;
        console.error("SSE connection error", err);
        setStreamStatus("ERROR");
        scheduleReconnect(pid);
        // Throwing error allows library to execute its own retry loop or fallback
        throw err;
      },
    });
  }, [fetchHistory, mergeActivities]);

  // Schedule reconnect with controlled bounded backoff
  const scheduleReconnect = useCallback((pid: number) => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    const delays = [1000, 2000, 5000, 10000];
    const delay = delays[Math.min(retryCountRef.current, delays.length - 1)];
    retryCountRef.current += 1;

    retryTimeoutRef.current = setTimeout(() => {
      if (projectIdRef.current === pid) {
        connectStream(pid);
      }
    }, delay);
  }, [connectStream]);

  // Effect to manage connection lifecycles on mount, project switch and unmount
  useEffect(() => {
    projectIdRef.current = projectId;
    setActivities([]);
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setStreamStatus("DISCONNECTED");
    retryCountRef.current = 0;

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    if (projectId > 0) {
      // Connect to the stream (this will internally fetch REST history on success)
      connectStream(projectId);
      // Concurrently fire initial REST history in case SSE setup takes longer
      fetchHistory(projectId);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [projectId, connectStream, fetchHistory]);

  // Shared relative-time interval ticker (updates approx every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTicker((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    activities,
    isLoading,
    isError,
    error,
    streamStatus,
    timeTicker,
  };
}
