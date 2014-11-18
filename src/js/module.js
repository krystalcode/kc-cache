angular.module('kcCache', ['jmdobry.angular-cache'])

.factory('kcCacheLocalFactory', function($q, $angularCacheFactory) {
  var defaultName   = 'global';
  var defaultConfig = {
    // 1 hour.
    maxAge: 3600000,
    // Remove items from cache when expired.
    deleteOnExpire: 'passive',
    // 1 day.
    cacheFlushInterval: 86400000,
    // Sync to localStorage.
    storageMode: 'localStorage',
    // Capacity in number of entries.
    capacity: 144
  };

  // Variable to hold the AngularCache object.
  var cache;
  // Methods to convert to promise-based.
  var methodsToWrap = ['setOptions', 'get', 'put', 'remove', 'removeExpired', 'removeAll', 'destroy', 'info', 'keySet', 'keys'];

  var promiseCache = {
    init: function(options) {
      // Define options as an object if not defined.
      if (typeof(options) == 'undefined') {
        options = {};
      }

      // Give a default cache name if not defined.
      if (typeof(options.name) == 'undefined') {
        options.name = defaultName;
      }

      // Merge options.config into defaultConfig.
      if (typeof(options.config) == 'undefined') {
        options.config = {};
      }
      options.config = angular.extend({}, defaultConfig, options.config);

      // Create the cache.
      cache = $angularCacheFactory(options.name, options.config);

      // Convert all methods to promise-based.
      angular.forEach(methodsToWrap, function(method) {
        promiseCache[method] = function() {
          var deferred = $q.defer();
          try {
            var value = cache[method].apply(cache, arguments);
            // @todo: check the return value of other methods and add them here
            // like 'remove' if needed.
            if (typeof(value) == 'undefined' && method != 'remove') {
              deferred.reject(null);
            }
            deferred.resolve(value);
          } catch (err) {
            deferred.reject(err);
          }
          return deferred.promise;
        };
      });
    },
    putListItems: function(keyPrefix, items, idField) {
      for (key in items) {
        this.put(
          [keyPrefix, items[key][idField]].join('/'),
          items[key]
        );
      }
    }
  };

  return promiseCache;
})

.factory('kcCacheMemoryFactory', function($q, $angularCacheFactory) {
  var defaultName   = 'memory';
  var defaultConfig = {
    // 1 hour.
    maxAge: 3600000,
    // Remove items from cache when expired.
    deleteOnExpire: 'passive',
    // 1 day.
    cacheFlushInterval: 86400000,
    // Sync to localStorage.
    storageMode: 'none',
    // Capacity in number of entries.
    capacity: 1728
  };

  // Variable to hold the AngularCache object.
  var cache;
  // Methods to convert to promise-based.
  var methodsToWrap = ['setOptions', 'get', 'put', 'remove', 'removeExpired', 'removeAll', 'destroy', 'info', 'keySet', 'keys'];

  var promiseCache = {
    init: function(options) {
      // Define options as an object if not defined.
      if (typeof(options) == 'undefined') {
        options = {};
      }

      // Give a default cache name if not defined.
      if (typeof(options.name) == 'undefined') {
        options.name = defaultName;
      }

      // Merge options.config into defaultConfig.
      if (typeof(options.config) == 'undefined') {
        options.config = {};
      }
      options.config = angular.extend({}, defaultConfig, options.config);

      // Create the cache.
      cache = $angularCacheFactory(options.name, options.config);

      // Convert all methods to promise-based.
      angular.forEach(methodsToWrap, function(method) {
        promiseCache[method] = function() {
          var deferred = $q.defer();
          try {
            var value = cache[method].apply(cache, arguments);
            // @todo: check the return value of other methods and add them here
            // like 'remove' if needed.
            if (typeof(value) == 'undefined' && method != 'remove') {
              deferred.reject(null);
            }
            deferred.resolve(value);
          } catch (err) {
            deferred.reject(err);
          }
          return deferred.promise;
        };
      });
    },
    putListItems: function(keyPrefix, items, idField) {
      for (key in items) {
        this.put(
          [keyPrefix, items[key][idField]].join('/'),
          items[key]
        );
      }
    }
  };

  return promiseCache;
})

;
