chrome.tabs.query({ active: !0, currentWindow: !0 }, async tabs => {
  try {
    let t = tabs[0];
    let results = await chrome.scripting.executeScript({
      target: { tabId: t.id },
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
    });
    if (results &&= results[0].result) {
      let encodedBodySize = results[2];
      let compressionRatio = results[4];
      if (compressionRatio == "100%") {
        let response = await fetch (t.url);
        if (response.status == 200) {
          let bytes = results[5] = (await (
            new Response(response.body.pipeThrough(new CompressionStream("gzip")))
          ).bytes()).length;
          results[6] = (bytes / encodedBodySize * 100).toFixed(1) + "%";
          results[5] = bytes + "";
        }
      }
      results[2] = encodedBodySize + "";
      let maxLength = Math.max(results[1].length, results[3].length, compressionRatio.length, results[7].length);
      let u = document.body.children;
      let i = 12;
      while (
        u[--i].textContent = (t = results[i]) ? t.padStart(maxLength, " ") : "", 
        i
      );
    }
  } catch (e) {}
});