chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs => {
  let t = tabs[0];
  let url = t.url;
  url[0] != "c" && chrome.scripting.executeScript({
    target: { tabId: t.id },
    world: "MAIN",
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
        decodedBodySize.toString(),
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
  }, async results => {
    if (results &&= results[0].result) {
      if (results[4] == "100%") {
        let response = await fetch (url);
        if (response.status == 200) {
          results[5] = 0;
          let reader = (await (await response.body).pipeThrough(new CompressionStream("gzip"))).getReader();
          let chunk;
          while (!(chunk = await reader.read()).done)
            results[5] += chunk.value.length;
          results[6] = (results[5] / results[2] * 100).toFixed(1) + "%";
          results[5] = results[5].toString();
        }
      }
      results[2] = results[2].toString();
      let maxLength = Math.max(results[1].length, results[3].length, results[4].length, results[7].length);
      let u = document.body.children;
      let i = 12;
      while (
        u[--i].textContent = (t = results[i]) ? t.padStart(maxLength, " ") : "", 
        i
      );
    }
  });
});