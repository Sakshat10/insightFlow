export const AUTH_STORAGE_KEYS = {
  TOKENS: "insightflow_tokens",
  USER: "insightflow_user",
} as const;

export type AuthStorageKeys = typeof AUTH_STORAGE_KEYS;
