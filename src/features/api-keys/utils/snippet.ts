export function buildInstallationSnippet(apiKey: string, sdkUrl: string): string {
  return `<script>
  window.insightflow=window.insightflow||[];
  (function(d){
    var s=d.createElement('script');
    s.async=true;
    s.src='${sdkUrl}';
    s.setAttribute('data-key','${apiKey}');
    d.head.appendChild(s);
  })(document);
</script>`;
}
