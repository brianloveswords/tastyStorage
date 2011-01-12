// determine JSON stringifier/parser to use.
(function(global, document, JSON){
  var prepare_storage = function(scope){
    if (!JSON || !JSON.stringify || !JSON.parse) {
      throw new Error("tastystorage.js: Expecting a JSON object with stringify() and parse() methods.");
    }
    
    var STORAGE_NAME = scope+'Storage',
        STORAGE_REGEXP = RegExp(STORAGE_NAME+'=([^;]*)'),
        FRESH = (scope !== 'session') && ';expires=Tue, 13 Aug 2100 07:30:00 UTC' || '',
        SPOILED = ';expires=Tue, 13 Aug 1985 07:30:00 UTC',
        
        encode = function(object){
          var stringed = JSON.stringify(object);
          return encodeURIComponent(stringed);
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
      'len': function() {
        var length = 0;
        for (var prop in storage) storage.hasOwnProperty(prop) && (length += 1);
        return length;
      }
    };
  };
  var augment = function(storage) {
    return {
      'interface': 'DOMStorage',
      'clear': storage.clear,
      'removeItem': storage.removeItem,
      'setItem': function(key, value){
        return storage.setItem(key, JSON.stringify(value));
      },
      'getItem': function(key) {
        return JSON.parse(storage.getItem(key));
      },
      'len': function() {
        return storage.length;
      }
    };
  };
  /**
   * @constructor
   */
  var StorageWrapper = function(scope){
    /* make sure we're constructing */
    if ( !(this instanceof arguments.callee) ) return new StorageWrapper(scope);
    scope = scope || 'local';
    var existing_storage = global[scope+'Storage'];
    var methods = null;
    
    if (existing_storage instanceof Storage) {
      methods = augment(existing_storage);
    } else { 
      methods = prepare_storage(scope);
    }
    
    var iface = (function(){
      /* if called as a constructor, construct a new StorageWrapper */
      if (this instanceof arguments.callee) return new StorageWrapper(arguments[0]);
      if (arguments.length == 0) return methods.len();
      if (arguments.length == 1) return methods.getItem(arguments[0]);
      if (arguments.length == 2) return methods.setItem(arguments[0], arguments[1]);
      return undefined;
    });
      
    for (var method in methods) {
      if (methods.hasOwnProperty(method)) iface[method] = methods[method];
    }
    
    return iface;
  };
  
  global['tastyStorage'] = new StorageWrapper('local');
})(this, this.document, JSON);
