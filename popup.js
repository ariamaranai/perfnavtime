chrome.tabs.query({ active: !0, currentWindow: !0 }, async tabs => {
  try {
    let tab = tabs[0];
    let target = { tabId: tab.id };
    let url = tab.url;
    let isHttp = url.startsWith("http");
    let result = (await chrome.scripting.executeScript({
      target,
      files: [isHttp ? "http.js" : "file.js"],
    }))[0].result;
    let node = document.body.lastChild;
    return isHttp
      ? node.textContent = result
      : (
        await chrome.debugger.attach(target, "1.3"),
        chrome.debugger.sendCommand(target, "Network.enable"),
        chrome.debugger.onEvent.addListener((_, method, params) =>
          method == "Network.requestWillBeSent" &&
          params.request.url == url &&
          chrome.debugger.sendCommand(target, "Network.getResponseBody", { requestId: params.requestId }, async r => {
            chrome.debugger.detach(target);
            let b = r.body;
            let bodySize = b.length;
            r.base64Encoded && (b = Uint8Array.fromBase64(b));
            let gzippedSize = (await (new Response((new Blob([b])).stream().pipeThrough(new CompressionStream('gzip')))).arrayBuffer()).byteLength;
            let localeBodySize = bodySize.toLocaleString() + " bytes\n";
            node.textContent =
              "file\n\n" +
              localeBodySize +
              localeBodySize +
              "\n100%\n" +
              gzippedSize.toLocaleString() + " bytes\n" +
              (gzippedSize / bodySize * 100).toFixed(1) + " %\n" +
              result;
          })
        ),
        chrome.tabs.reload()
      )
  } catch {}
});