chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs =>
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    func: () => {
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
    }
  }).then(async results => {
    let result = results[0].result;
    let encodedBodySize = result[2];
    let n = result[4];
    if (n == "100%") {
      let response = await fetch (tabs[0].url);
      if (response.status == 200) {
        let bytes = result[5] = (await (new Response(response.body.pipeThrough(new CompressionStream("gzip")))).bytes()).length;
        result[6] = (bytes / encodedBodySize * 100).toFixed(1) + "%";
        result[5] = bytes + "";
      }
    }
    result[2] = encodedBodySize + "";
    let maxLength = Math.max(result[1].length, result[3].length, n.length, result[7].length);
    let u = document.body.children;
    let i = 12;
    while (
      u[--i].textContent = (n = result[i]) ? n.padStart(maxLength, " ") : "",
      i
    );
  }).catch(() => 0)
);