// determine JSON stringifier/parser to use.

(function(global, document, JSON){
  var prepare_storage = function(scope){
    if (!JSON || !JSON.stringify || !JSON.parse) {
      throw new Error("tastystorage.js: Expecting a JSON object with stringify() and parse() methods.");
    }
    
    var STORAGE_NAME = scope+'Storage',
        STORAGE_REGEXP = RegExp(STORAGE_NAME+'=([a-zA-Z0-9%]*)'),
        FRESH = (scope == 'local') && ';expires=Tue, 13 Aug 2100 07:30:00 UTC' || '',
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
        },
        calculate_length = function(){
          var len = 0;
          for (var prop in storage) storage.hasOwnProperty(prop) && (len += 1);
          return len;
        };
    
    
    return {
      'interface': 'document.cookie',
      'clear': function() {
        document.cookie = STORAGE_NAME + '=null' + SPOILED;
        this.length = 0;
      },
      'getItem': function(key) {
        return storage[key];
      },
      'setItem': function(key, value) {
        storage[key] = value;
        this.length = calculate_length();
        update();
        return value;
      },
      'removeItem': function(key) {
        delete storage[key];
        this.length = calculate_length();
        update();
      },
      'length': calculate_length()
    };
  };
  alert('defining constructor');
  /**
   * @constructor
   */
  var StorageWrapper = function(scope){
    var iface = prepare_storage(scope);
    for (var prop in iface) iface.hasOwnProperty(prop) && (this[prop] = iface[prop]);
  };
  
  alert('providing fallbacks');
  global['localStorage'] || (global['localStorage'] = new StorageWrapper('local'));
  global['sessionStorage'] || (global['sessionStorage'] = new StorageWrapper('session'));
  
  alert('fallbacks defined');
})(this, this.document, JSON);
