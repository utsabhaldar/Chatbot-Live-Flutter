'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "7772a5df0e37fd43b9c639ff9966c602",
"assets/AssetManifest.bin.json": "735026a780e6baf33edd84579061cfdc",
"assets/AssetManifest.json": "1243520c834541e012b3b885572437b6",
"assets/assets/about_images/1.jpg": "4eb739052ac00458bd0379923443a907",
"assets/assets/about_images/10.jpg": "ff3d193b096673e976f7324bbe835e8b",
"assets/assets/about_images/11.jpg": "7db5a3b1798a8fd23b88f9c0c6d812b0",
"assets/assets/about_images/12.jpg": "473a62af1719b26cb535f48d8a0076c3",
"assets/assets/about_images/13.jpg": "da0f71858768ac4610bd453a2ad44175",
"assets/assets/about_images/2.jpg": "8ac268f52c69b3405dd9b454f46fce13",
"assets/assets/about_images/3.jpg": "be33aa408a0463b4e761d8621d4e51f6",
"assets/assets/about_images/4.jpg": "facb9f22a23d04c257d4d30a6d4f027a",
"assets/assets/about_images/5.jpg": "04e988b83c9d38dbe476579d7126a14e",
"assets/assets/about_images/6.jpg": "ec1163adcfed7a54dd766d671418af8f",
"assets/assets/about_images/7.jpg": "766a825161e6f9573dad160853c7f3cc",
"assets/assets/about_images/8.jpg": "4e77f1483c27e0b1824bfc1ffa7c98c4",
"assets/assets/about_images/9.jpg": "82ac7a04b9f08252fd0acbc5e7ca4395",
"assets/assets/images/abhishek.jpg": "a00c6493fe6bb507bee9302a0528af5e",
"assets/assets/images/app_logo.jpg": "d038a0a6c6f56a2eed43071703f74ef7",
"assets/assets/images/arvind.jpg": "37f3c05f4bd68b8515c36bac3218f4c0",
"assets/assets/images/jahanavi.jpg": "7a1f080d69fa13b39c7f2faf739fefcd",
"assets/assets/images/mukesh.jpg": "e19172514aacd6ee81e23196a2691c44",
"assets/assets/images/nill.jpg": "353bf3c5ee77b06b7b92044dbf48f7a5",
"assets/assets/images/sakshi.jpg": "d69ded7d86f7b9ccae7db20d35aa8560",
"assets/assets/images/utsab.png": "9c25caba869e402808fcda14d4ad0b43",
"assets/assets/images/varun.jpg": "19438eca085f501ccb2be70544d15ca0",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "5586f7262ed637461868092912b57a71",
"assets/NOTICES": "4f7b60d7b99c232707e09ee89f008cad",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "4537ef35d3b9a5f206ae4615b2f5f5f1",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"index.html": "54abde6346316d7f52acb0625f904b5e",
"/": "54abde6346316d7f52acb0625f904b5e",
"main.dart.js": "15bf3e5470a7b7578e58810a41db43d0",
"manifest.json": "ea39fe83eb7df23f7e656289b8c63d9f",
"version.json": "70370916868cbf4a19fbea9db236032e"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
