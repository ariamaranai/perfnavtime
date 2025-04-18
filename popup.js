chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs =>
  chrome.userScripts.execute({
    target: { tabId: tabs[0].id },
    js: [{ code:
`(() => {
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
  return [
    nextHopProtocol,
    deliveryType,
    encodedBodySize,
    decodedBodySize + "",
    encodedBodySize == decodedBodySize ? "100%" : (encodedBodySize / decodedBodySize * 100).toFixed(1) + "%",
    0,
    0,
    duration.toFixed(1) + "ms",
    (requestStart - secureConnectionStart).toFixed(1) + "ms",
    (responseEnd - responseStart).toFixed(1) + "ms",
    (domContentLoadedEventEnd - domContentLoadedEventStart).toFixed(1) + "ms",
    (domComplete - domInteractive).toFixed(1) + "ms"
  ];
})();`
    }]
  }).then(results => {
    let result = results[0].result;
    let encodedBodySize = result[2];
    let n = result[4];
    let f = () => {
      let maxLength = Math.max(result[1].length, result[3].length, n.length, result[7].length);
      let u = document.body.children;
      let i = 12;
      while (
        u[--i].textContent = (n = result[i]) ? n.padStart(maxLength, " ") : "",
        i
      );
    }
    result[2] = encodedBodySize + "";
    n == "100%"
      ? fetch (tabs[0].url)
          .then(r => (new Response(r.body.pipeThrough(new CompressionStream("gzip")))).bytes())
            .then(({ length }) => (
              result[6] = (length / encodedBodySize * 100).toFixed(1) + "%",
              result[5] = length + "",
              f()
            )).catch(() => 0)
      : f();
  }).catch(() => 0)
);