(({
  duration,
  requestStart,
  secureConnectionStart,
  responseEnd,
  responseStart,
  domContentLoadedEventEnd,
  domContentLoadedEventStart,
  domComplete,
  domInteractive
}) =>
  duration.toFixed(1) + " ms\n" +
  (requestStart - secureConnectionStart).toFixed(1) + " ms\n" +
  (responseEnd - responseStart).toFixed(1) + " ms\n" +
  (domContentLoadedEventEnd - domContentLoadedEventStart).toFixed(1) + " ms\n" +
  (domComplete - domInteractive).toFixed(1) + " ms"
)(performance.getEntriesByType("navigation")[0]);