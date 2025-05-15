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

  let contentEncoding = "";
  let gzippedSize = "";
  let gzippedRatio = "";
  let compressionRatio = "";
  
  try {
    let r = await fetch (location.href);
    encodedBodySize == decodedBodySize
      ? (
        compressionRatio = "100 %",
        gzippedRatio = ((gzippedSize = (await (new Response(r.body.pipeThrough(new CompressionStream("gzip")))).bytes()).length) / encodedBodySize * 100).toFixed(1) + " %",
        gzippedSize = gzippedSize.toLocaleString("en-US") + " bytes"
      )
      : (
        compressionRatio = (encodedBodySize / decodedBodySize * 100).toFixed(1) + " %",
        contentEncoding = r.headers.get("content-encoding")
      );
  } catch (e) {}

  return nextHopProtocol + "\\n" +
    deliveryType + "\\n" +
    encodedBodySize.toLocaleString("en-US") + " bytes\\n" +
    decodedBodySize.toLocaleString("en-US") + " bytes\\n" +
    contentEncoding + "\\n" +
    compressionRatio + "\\n" +
    gzippedSize + "\\n" +
    gzippedRatio + "\\n" +
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