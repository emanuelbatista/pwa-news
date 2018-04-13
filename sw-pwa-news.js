(function () {
    'use strict';
    var API = 'https://newsapi.org/v2/';
    var SHELL_CACHE = "pwa-new-shell-cache-v3";
    var DATA_CACHE = "pwa-new-data-cache-v3";
    var SHELL_FILTER_TO_CACHE = [
        "/",
        "manifest.json",
        "/css/main.css",
        "/img/default.jpg",
        "/img/android-chrome-192x192.png",
        "/img/android-chrome-512x512.png",
        "/img/favicon-16x16.png",
        "/img/favicon-32x32.png",
        "favicon.ico",
        "/js/api.js",
        "/js/add-home-event.js",
        "/library/jquery-3.3.1.min.js",
        "/library/moment.min.js"
    ];

    self.addEventListener('install', function (e) {
        console.log("installing service worker");
        e.waitUntil(
            self.caches.open(SHELL_CACHE).then(function (cache) {
                return cache.addAll(SHELL_FILTER_TO_CACHE);
            })
        );
    });

    self.addEventListener('fetch', function (event) {
        console.log("fetch running");
        if (event.request.url.indexOf(API) === -1) {
            event.respondWith(
                caches.match(event.request).then(function (response) {
                    return response || fetch(event.request)
                })
            );
        } else {
            event.respondWith(
                fetch(event.request).then(function (response) {
                    return caches.open(DATA_CACHE).then(function (cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                }).catch(function (err) {
                    return caches.match(event.request);
                })
            );
        }
    })

    self.addEventListener('activate', function (e) {
        console.log("Service Worker activated running");
        var cacheList = [
            DATA_CACHE, SHELL_CACHE
        ];
        e.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheList.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });

    self.addEventListener('push', function(e){
        console.log('[Service Worker] Push Received.');
        console.log(`[Service Worker] Push had this data: "${e.data.text()}"`);

        const title = 'Push PWA News';
        const options = {
            body: e.data.text(),
            icon: '/img/android-chrome-512x512.png',
            badge: '/img/android-chrome-512x512.png'
        };
        e.waitUntil(
            self.registration.showNotification(title, options)
        );
    });


})();
