chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs =>
  tabs[0].url[0] != "c" && chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    world: "MAIN",
    func: async () => {
      let entry = performance.getEntriesByType("navigation")[0];
      let ratio = "100%"; 
      let gzippedSize = "";
      let gzippedRatio = "";
      if (entry.encodedBodySize != entry.decodedBodySize) {
        let res = await fetch (location.href);
        if (res.status == 200) {
          gzippedSize = 0;
          let stream = await (await res.body).pipeThrough(new CompressionStream("gzip"));
          let reader = stream.getReader();
          let chunk;
          while (!(chunk = await reader.read()).done)
            gzippedSize += chunk.value.length;
          gzippedSize = gzippedSize.toString();
          gzippedRatio = (gzippedSize / entry.decodedBodySize * 100).toFixed(1) + "%"; 
        }
      } else
        ratio = (entry.encodedBodySize / entry.decodedBodySize * 100).toFixed(1) + "%";
      return [
        entry.nextHopProtocol,
        entry.deliveryType,
        entry.encodedBodySize.toString(),
        entry.decodedBodySize.toString(),
        ratio,
        gzippedSize,
        gzippedRatio,
        entry.duration.toFixed(1) + "ms",
        (entry.requestStart - entry.secureConnectionStart).toFixed(1) + "ms",
        (entry.responseEnd - entry.responseStart).toFixed(1) + "ms",
        (entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart).toFixed(1) + "ms",
        (entry.domComplete - entry.domInteractive).toFixed(1) + "ms"
      ];
    }
  }, results => {
    if (results &&= results[0].result) {
      let maxLength = Math.max(results[1].length, results[3].length, results[4].length, results[7].length);
      let u = document.body.children;
      let i = 12;
      while (u[--i].textContent = results[i].padStart(maxLength, " "), i);
    }
  })
);