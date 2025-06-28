chrome.tabs.query({ active: !0, currentWindow: !0 }, async tabs => {
  let { url, id } = tabs[0];
  let target = { tabId: id };
  let isHttp = url[0] == "h";
  try {
    let { result } = (await chrome.userScripts.execute({
      target,
      js: [{ file: isHttp ? "http.js" : "file.js" }]
    }))[0];
    let node = document.body.lastChild;
    isHttp
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
            if (r.base64Encoded) {
              let bs = atob(b.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((b.length + 3) % 4));
              b = new Uint8Array(bodySize = bs.length);
              let i = 0;
              while (
                b[i] = bs.charCodeAt(i),
                ++i < bs.length
              );
            }
            let gzippedSize = (await (new Response((new Blob([b])).stream().pipeThrough(new CompressionStream('gzip')))).arrayBuffer()).byteLength;
            let localeBodySize = bodySize.toLocaleString("en-US") + " bytes\n";
            node.textContent =
              "file\n\n" +
              localeBodySize +
              localeBodySize +
              "\n100%\n" +
              gzippedSize.toLocaleString("en-US") + " bytes\n" +
              (gzippedSize / bodySize * 100).toFixed(1) + " %\n" +
              result;
          })
        ),
        chrome.tabs.reload()
      )
  } catch {}
});