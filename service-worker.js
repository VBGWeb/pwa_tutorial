/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren */
'use strict';





/* eslint-disable quotes, comma-spacing */
var PrecacheConfig = [["css/style.css","84a33cf00d95bc1e3617cc35262f7e94"],["dev.html","f756ed7aa48054047c0ab1ef97b01706"],["img/adam.jpg","b445da3cc203f97bce534fdad93b3931"],["img/ben.png","2d983b2362f6db11855af918c7f95aee"],["img/ionic.png","251ebf03b1c7889cf36cbcbcce8f689e"],["img/max.png","66572ace014ac9119866c3190c8a0a03"],["img/mike.png","14650dc9e2aa1661facc830ab5fb7d6a"],["img/perry.png","2f6e587dfaf552ec19045b4719bc534c"],["index.html","6de25b5e31d9c76b02179693c81d8c28"],["js/app.js","e6ecd58daf25d6ec2ff304f4f9657eec"],["js/controllers.js","03c7da43563eaf45286e9ef99fb45ed6"],["js/pushNotification.js","137de93ee2fe7bb8e9fd13aaed58178a"],["js/service-worker-registration.js","c1ee5aec388e1ed07d6d290693b72547"],["js/services.js","d9d96b5559c65152eadef27202572e75"],["lib/ionic/css/ionic.css","6c0bf3573541798030d03a003db95e25"],["lib/ionic/css/ionic.min.css","5b49b6261b82f3fccaaeaa9732820607"],["lib/ionic/fonts/ionicons.eot","2c2ae068be3b089e0a5b59abb1831550"],["lib/ionic/fonts/ionicons.svg","621bd386841f74e0053cb8e67f8a0604"],["lib/ionic/fonts/ionicons.ttf","24712f6c47821394fba7942fbb52c3b2"],["lib/ionic/fonts/ionicons.woff","05acfdb568b3df49ad31355b19495d4a"],["lib/ionic/js/angular-ui/angular-ui-router.js","1f7fe3573d463743394e98d8b00eb228"],["lib/ionic/js/angular-ui/angular-ui-router.min.js","83f32131b638a8686a43510fbd645b1b"],["lib/ionic/js/angular/angular-animate.js","b1a0315d4738ba305aca3b00146e232c"],["lib/ionic/js/angular/angular-animate.min.js","fb61c6d539943f24f85f49cad4c187b5"],["lib/ionic/js/angular/angular-resource.js","523cfbb962e367e90da4bf1976b53d7f"],["lib/ionic/js/angular/angular-resource.min.js","8da982bb4bc3275659b4c081f34f9b7c"],["lib/ionic/js/angular/angular-sanitize.js","7b57f04a2b23847203394400eeb2c97d"],["lib/ionic/js/angular/angular-sanitize.min.js","04a7b73d1dc5d573a5b17d70122e8781"],["lib/ionic/js/angular/angular.js","1b3d5bfbeb67c93df0f8ee9de569a206"],["lib/ionic/js/angular/angular.min.js","0744b6e5cd7b7cdad98cefb3d9c141c6"],["lib/ionic/js/ionic-angular.js","1133d4ae24c4e4dbfa0d6aef4c1eab45"],["lib/ionic/js/ionic-angular.min.js","2244ce0a43649ac14ff76709a851b222"],["lib/ionic/js/ionic.bundle.min.js","649bff948e39e3fda4000c5de5789599"],["lib/ionic/js/ionic.js","55f150998acc957ee195f71739ffb71b"],["lib/ionic/js/ionic.min.js","c33408e514a0764bfaff38533382bcfd"],["lib/ionic/version.json","dad8b70ac11bec5ce5e51d7de697228c"],["templates/chat-detail.html","2d7611935a285c43bb38285711ea6711"],["templates/tab-account.html","ec5f7001ddc6166a343ab7f26984a4d9"],["templates/tab-chats.html","8f6887faf4ac352053dce859f32cda6b"],["templates/tab-dash.html","543dafb08657906b6aa925eaa60e4a0b"],["templates/tabs.html","a5944007625722f9c15f002b9d58f0b9"]];
/* eslint-enable quotes, comma-spacing */
var CacheNamePrefix = 'sw-precache-v1--' + (self.registration ? self.registration.scope : '') + '-';




var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var getCacheBustedUrl = function (url, now) {
    now = now || Date.now();

    var urlWithCacheBusting = new URL(url);
    urlWithCacheBusting.search += (urlWithCacheBusting.search ? '&' : '') +
      'sw-precache=' + now;

    return urlWithCacheBusting.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var populateCurrentCacheNames = function (precacheConfig,
    cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  var now = Date.now();

  event.waitUntil(
    caches.keys().then(function(allCacheNames) {
      return Promise.all(
        Object.keys(CurrentCacheNamesToAbsoluteUrl).filter(function(cacheName) {
          return allCacheNames.indexOf(cacheName) === -1;
        }).map(function(cacheName) {
          var urlWithCacheBusting = getCacheBustedUrl(CurrentCacheNamesToAbsoluteUrl[cacheName],
            now);

          return caches.open(cacheName).then(function(cache) {
            var request = new Request(urlWithCacheBusting, {credentials: 'same-origin'});
            return fetch(request).then(function(response) {
              if (response.ok) {
                return cache.put(CurrentCacheNamesToAbsoluteUrl[cacheName], response);
              }

              console.error('Request for %s returned a response with status %d, so not attempting to cache it.',
                urlWithCacheBusting, response.status);
              // Get rid of the empty cache if we can't add a successful response to it.
              return caches.delete(cacheName);
            });
          });
        })
      ).then(function() {
        return Promise.all(
          allCacheNames.filter(function(cacheName) {
            return cacheName.indexOf(CacheNamePrefix) === 0 &&
                   !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }).then(function() {
      if (typeof self.skipWaiting === 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim === 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command === 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});


/*
 * Este script de Service Worker procesa los dos eventos principales: 
 * - llega una push notification
 * - el usuario la acepta haciendo click o tap en el aviso que le muestra el SO o browser
 * 
 */

// In a service worker, self refers to the ServiceWorkerGlobalScope object: the service worker itself.
// https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData
self.addEventListener('push', function(event) {
  console.log('Push message received', event);
  var title = 'Novedades en PWA';
  // Armamos el body ( texto del mensaje a mostrar en la notificación )
  var body = 'Hay nuevo contenido en PWA';
  if ( event.data && event.data.json()) {
      var eventData = event.data.json();
      body = eventData.body;
  }
  var data = event.data ? event.data.json() : 'no payload';
  event.waitUntil(
    // Mostramos la notificación.
    self.registration.showNotification(title, {
      body: body,
      icon: 'img/ionic.png',
      tag: 'generic_notification',
      data: data
    }));
});

/*
 * Este evento en enviado cuando el usuario clickea en la notificación
 * 
 */ 
self.addEventListener('notificationclick', function(event) {
    // https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent/notification
    console.log('Notification click: tag ', event.notification.tag);
    console.log('Notification click: data ', event.notification.data);
    //NOTE: Android doesn’t close the notification when you click it.
    //That’s why we need event.notification.close();.
    event.notification.close();

    event.waitUntil(
        // Un service worker puede atender varios clientes, acá buscamos las ventanas ( tabs y apps )
        // y enviamos un mensaje a cada una
        //https://developer.mozilla.org/en-US/docs/Web/API/Clients
        clients.matchAll({
            type: 'window'
        })
        .then(function(windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                console.log('client: ', JSON.stringify(client));
                // https://developer.mozilla.org/en-US/docs/Web/API/Client
                //
                // TODO Para no tener que hacer este broadcast, puedo usar ports como muestran en:
                // https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage
                client.postMessage(event.notification.data);
                // Activamos el tab de pwa
                if (client.url.indexOf("pwa") !== 0 ) {
                    return client.focus();
                }
            }
        })
    );
});