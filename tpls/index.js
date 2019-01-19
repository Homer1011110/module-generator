/*
    module: [tpl]name[/tpl]
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

// html的缓存策略
workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
    new RegExp('.*\.(?:js|css|eot|ttf|woff|woff2|otf|svg|png|jpg)'),
    workbox.strategies.cacheFirst()
);