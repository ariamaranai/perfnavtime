chrome.tabs.query({ active: !0, currentWindow: !0 }).then(tabs =>
  tabs[0].url[0] != "c" && chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    world: "MAIN",
    func: () => {
      let entry = performance.getEntriesByType("navigation")[0];
      let duration = entry.duration.toFixed(1);
      let f = t => t.toFixed(1).padStart(duration.length, " ") + "ms";
      let ratio = (entry.encodedBodySize / entry.decodedBodySize * 100).toFixed(1) + "%";
      return [
        entry.nextHopProtocol,
        entry.deliveryType,
        entry.encodedBodySize.toString().padStart(ratio.length, " "),
        entry.decodedBodySize.toString().padStart(ratio.length, " "),
        ratio,
        duration + "ms",
       f(entry.requestStart - entry.secureConnectionStart),
       f(entry.responseEnd - entry.responseStart),
       f(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart),
       f(entry.domComplete - entry.domInteractive)
      ];
    }
  }, results => {
    if (results) {
      let u = document.getElementsByTagName("u");
      let i = 10;
      while (u[--i].textContent = results[0].result[i], i);
    }
  })
);