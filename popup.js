chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs =>
  chrome.userScripts.execute({
    target: { tabId: tabs[0].id },
    js: [{ code:
`(async () => {
  let {
    nextHopProtocol,
    deliveryType,
    encodedBodySize,
    decodedBodySize,
    duration,
    requestStart,
    secureConnectionStart,
    responseEnd,
    responseStart,
    domContentLoadedEventEnd,
    domContentLoadedEventStart,
    domComplete,
    domInteractive
  } = performance.getEntriesByType("navigation")[0];

  let gzippedSize = "";
  let gzippedRatio = "";
  let compressionRatio = "";
  if (encodedBodySize == decodedBodySize) {
    compressionRatio = "100%";
    try {
      gzippedSize = (await (new Response((await fetch (location.href)).body.pipeThrough(new CompressionStream("gzip"))).bytes())).length;
    } catch (e) {}
    gzippedRatio = (gzippedSize / encodedBodySize * 100).toFixed(1) + "%";
  } else
    compressionRatio = (encodedBodySize / decodedBodySize * 100).toFixed(1) + "%";

  return nextHopProtocol + "\\n" +
    deliveryType + "\\n\\n" +
    encodedBodySize + "\\n" +
    decodedBodySize + "\\n" +
    compressionRatio + "\\n" +
    gzippedSize + "\\n" +
    gzippedRatio + "\\n\\n" +
    duration.toFixed(1) + " ms\\n" +
    (requestStart - secureConnectionStart).toFixed(1) + " ms\\n" +
    (responseEnd - responseStart).toFixed(1) + " ms\\n" +
    (domContentLoadedEventEnd - domContentLoadedEventStart).toFixed(1) + " ms\\n" +
    (domComplete - domInteractive).toFixed(1) + " ms";
})();`
    }]
  }).then(results =>
    (results &&= results[0].result) &&
    (document.body.lastChild.textContent = results)
  ).catch(() => 0)
);