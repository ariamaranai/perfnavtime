(async () => {
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
        gzippedRatio = ((gzippedSize = (await (new Response(r.body.pipeThrough(new CompressionStream("gzip")))).arrayBuffer()).byteLength) / encodedBodySize * 100).toFixed(1) + " %",
        gzippedSize = gzippedSize.toLocaleString("en-US") + " bytes"
      )
      : (
        compressionRatio = (encodedBodySize / decodedBodySize * 100).toFixed(1) + " %",
        contentEncoding = r.headers.get("content-encoding")
      );
  } catch {}

  return nextHopProtocol + "\n" +
    deliveryType + "\n" +
    encodedBodySize.toLocaleString("en-US") + " bytes\n" +
    decodedBodySize.toLocaleString("en-US") + " bytes\n" +
    contentEncoding + "\n" +
    compressionRatio + "\n" +
    gzippedSize + "\n" +
    gzippedRatio + "\n" +
    duration.toFixed(1) + " ms\n" +
    (requestStart - secureConnectionStart).toFixed(1) + " ms\n" +
    (responseEnd - responseStart).toFixed(1) + " ms\n" +
    (domContentLoadedEventEnd - domContentLoadedEventStart).toFixed(1) + " ms\n" +
    (domComplete - domInteractive).toFixed(1) + " ms";
})();