(function () {
    'use strict';
    var API = 'https://newsapi.org/v2/';
    var SHELL_CACHE = "pwa-new-shell-cache-v1";
    var DATA_CACHE = "pwa-new-data-cache-v1";
    var SHELL_FILTER_TO_CACHE = [
        "/",
        "/css/main.css",
        "/img/default.jpg",
        "/js/api.js",
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


})();
