// determine JSON stringifier/parser to use.

(function(global, document, JSON){
  var prepare_cookie = function(){
    if (!JSON || !JSON.stringify || !JSON.parse) {
      throw new Error("tastystorage.js: Expecting a JSON object with stringify() and parse() methods.");
    }
    
    var STORAGE_NAME = 'tastyStorage',
        STORAGE_REGEXP = RegExp(STORAGE_NAME+'=([a-zA-Z0-9%]*)'),
        FRESH = ';expires=Tue, 13 Aug 2100 07:30:00 UTC',
        SPOILED = ';expires=Tue, 13 Aug 1985 07:30:00 UTC',
        
        encode = function(object){
          return encodeURIComponent(JSON.stringify(object));
        },
        decode = function(string){
          var decoded = decodeURIComponent(string);
          return (decoded && JSON.parse(decoded));
        },
        storage = (function(){
          var matches = document.cookie.match(STORAGE_REGEXP),
              result = (matches && matches[1]) || '';
          return (decode(result) || {});
        })(),
        update = function(){
          document.cookie = STORAGE_NAME + '=' + encode(storage) + FRESH;
        };
    
    return {
      'interface': 'document.cookie',
      'clear': function() {
        document.cookie = STORAGE_NAME + '=null' + SPOILED;
      },
      'getItem': function(key) {
        return storage[key];
      },
      'setItem': function(key, value) {
        storage[key] = value;
        update();
        return value;
      },
      'removeItem': function(key) {
        delete storage[key];
        update();
      },
      'length': function(){
        var len = 0;
        for (var prop in storage) storage.hasOwnProperty(prop) && (len += 1);
        return len;
      }
    };
  };
  
  var prepare_local = function(){
    return {
      'interface': 'localStorage',
      'clear': localStorage.clear,
      'getItem': localStorage.getItem,
      'setItem': localStorage.setItem,
      'removeItem': localStorage.removeItem,
      'length': function() {
        return localStorage.length;
      }
    };
  };

  /**
   * @constructor
   */
  var StorageWrapper = function(){
    var iface = global['localStorage'] && prepare_local() || prepare_cookie();
    for (var prop in iface) iface.hasOwnProperty(prop) && (this[prop] = iface[prop]);
  };

  global['tastyStorage'] = new StorageWrapper();
})(this, this.document, JSON);
