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

  try {
    let r = await fetch(location.href);
    decodedBodySize =
      decodedBodySize.toLocaleString() + " bytes\n" + (
        encodedBodySize == decodedBodySize
          ? (
            (r = (await (new Response(r.body.pipeThrough(new CompressionStream("gzip")))).arrayBuffer()).byteLength) / encodedBodySize * 100,
            "\n100 %\n" +
            r.toLocaleString() + " bytes\n" +
            (r / encodedBodySize * 100).toFixed(1) + " %\n"
          )
          : r.headers.get("content-encoding") + "\n" +
            (encodedBodySize / decodedBodySize * 100).toFixed(1) + " %\n\n\n"
        )
  } catch {
    decodedBodySize = "\n\n\n\n\n";
  }

  return nextHopProtocol + "\n" +
    deliveryType + "\n" +
    encodedBodySize.toLocaleString() + " bytes\n" +
    decodedBodySize +
    duration.toFixed(1) + " ms\n" +
    (requestStart - secureConnectionStart).toFixed(1) + " ms\n" +
    (responseEnd - responseStart).toFixed(1) + " ms\n" +
    (domContentLoadedEventEnd - domContentLoadedEventStart).toFixed(1) + " ms\n" +
    (domComplete - domInteractive).toFixed(1) + " ms";
})();