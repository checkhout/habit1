// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  //当前环境是生产环境并且浏览器支持serverWorker
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    //返回一个新的URL，作为生成静态文件夹的路径，下面说明...
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      //如果静态文件和当前环境不在同一个域，注册没有意义，那就直接返回。
      return;
    }

    //页面加载完成执行以下代码....
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        /// 如果是本地环境，调用checkValidServiceWorker进行注册
        checkValidServiceWorker(swUrl, config);
        // 注册成功后，打印信息
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        // 如果不是本地环境（已经暴露在外网）仅仅只注册 service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

/*注册有效serviceWorker*/
function registerValidSW(swUrl, config) {
  //注册有效的serviceWorker，然后使用提供的API进行操作
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      //如果内容有更新，就会自动进行安装
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // 向服务端申请资源
  fetch(swUrl)
    .then(response => {
      // 如果连接失败或者没有返回js
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // 那么当 service worker 状态就绪的时候取消其注册状态
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            //并且重新加载页面
            window.location.reload();
          });
        });
      } else {
        // 如果申请到资源，那么就调用 registerValidSW 方法来进行加载
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  //如果支持serviceWorker，并且处于就绪状态，那么调用其提供的取消注册方法
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
