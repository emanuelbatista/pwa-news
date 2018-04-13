(function () {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw-pwa-news.js')
                .then(function (registration) {
                    console.log("Registrado com escopo", registration.scope);
                    notifyMe();
                }).catch(function (error) {
                    console.log("SW Refistrando error: ", error);
                });
        });
    } else {
        console.warn('Push messaging or service worker is not supported');
    }

    function notifyMe() {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
        }  else {
          Notification.requestPermission();
        }
      }

})();