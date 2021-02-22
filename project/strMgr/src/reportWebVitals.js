/*
* Web Vitals 帮助网站开发者聚焦在核心性能指标上核心性能指标，也称为 Core Web Vitals。
*
* Largest Contentful Paint (LCP): 衡量加载性能。为了提供一个好的用户体验，LCP应该在2.5秒内。
* First Input Delay (FID): 衡量可交互性。为了提供一个好的用户体验，FID应该在100毫秒内。
* Cumulative Layout Shift (CLS): 衡量视觉稳定性。为了提供一个好的用户体验，CLS应该小于0.1。
* */
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);//First Contentful Paint 关于加载性能的，有助于诊断LCP
      getLCP(onPerfEntry);//缓慢的服务端响应，或者渲染阻塞的资源
      getTTFB(onPerfEntry);//Time to First Byte 关于加载性能的，有助于诊断LCP
    });
  }
};

export default reportWebVitals;
