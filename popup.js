chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs => {
  let url = tabs[0].url;
  url[0] != "c" && chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    world: "MAIN",
    func: async () => {
      let entry = performance.getEntriesByType("navigation")[0];
      let { encodedBodySize, decodedBodySize } = entry;
      return [
        entry.nextHopProtocol,
        entry.deliveryType,
        encodedBodySize,
        decodedBodySize.toString(),
        encodedBodySize == decodedBodySize ? "100%" : (encodedBodySize / decodedBodySize * 100).toFixed(1) + "%",
        "",
        "",
        entry.duration.toFixed(1) + "ms",
        (entry.requestStart - entry.secureConnectionStart).toFixed(1) + "ms",
        (entry.responseEnd - entry.responseStart).toFixed(1) + "ms",
        (entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart).toFixed(1) + "ms",
        (entry.domComplete - entry.domInteractive).toFixed(1) + "ms"
      ];
    }
  }, async results => {
    if (results &&= results[0].result) {
      if (results[4] == "100%") {
        let res = await fetch (url);
        if (res.status == 200) {
          results[5] = 0;
          let stream = await (await res.body).pipeThrough(new CompressionStream("gzip"));
          let reader = stream.getReader();
          let chunk;

          while (!(chunk = await reader.read()).done) {
            console.log(chunk.value);
            results[5] += chunk.value.length;
          }
          results[6] = (results[5] / results[2] * 100).toFixed(1) + "%";
          results[5] = results[5].toString();
        }
      }
      results[2] = results[2].toString();
      let maxLength = Math.max(results[1].length, results[3].length, results[4].length, results[7].length);
      let u = document.body.children;
      let i = 12;
      while (u[--i].textContent = results[i].padStart(maxLength, " "), i);
    }
  })
});