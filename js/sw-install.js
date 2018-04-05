(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function(){
            navigator.serviceWorker.register('/sw-pwa-news.js')
            .then(function (registration) {
                console.log("Registrado com escopo", registration.scope);
            }).catch(function (error) {
                console.log("SW Refistrando error: ", error);
            });
        });
    }
})();