// determine JSON stringifier/parser to use.

(function(global, document, JSON, undefined){
  var prepare_cookie = function(){
    var STORAGE_NAME = 'tastyStorage';
    var STORAGE_REGEXP = RegExp(STORAGE_NAME+'=([a-zA-Z0-9%]*)');
    var SPOILED = ';expires=Tue, 13 Aug 1985 07:30:00 UTC';
    if (!JSON || !JSON.stringify || !JSON.parse) {
      throw new Error("tastystorage.js: Expecting a JSON object with stringify() and parse() methods.");
    }
    var encode = function(object){
      return global.encodeURIComponent(JSON.stringify(object));
    };
    var decode = function(string){
      var decoded = global.decodeURIComponent(string);
      return (decoded && JSON.parse(decoded));
    };
    var storage = (function(){
      var matches = document.cookie.match(STORAGE_REGEXP),
          result = (matches && matches[1]) || '';
      return (decode(result) || {});
    })();
    var update = function(){
      document.cookie = STORAGE_NAME + '=' + encode(storage);
    };
    this.interface = 'document.cookie';
    this['clear'] = function(){
      document.cookie = STORAGE_NAME + '=null' + SPOILED;
    };
    this['getItem'] = function(key){
      return storage[key];
    };
    this['setItem'] = function(key, value){
      if (value === undefined) throw new Error('You must set a value when using setItem(key, value)');
      storage[key] = value;
      update();
      return value;
    };
    this['removeItem'] = function(key) {
      delete storage[key];
      update();
    };
    this['length'] = function(){
      var len = 0;
      for (var prop in storage) storage.hasOwnProperty(prop) && (len += 1);
      return len;
    };
  };
  
  var prepare_local = function(){
    this.interface = 'localStorage';
    this['clear'] = function(){
      return localStorage.clear();
    };
    this['getItem'] = function(key){
      return localStorage[key];
    };
    this['setItem'] = function(key, value){
      if (value === undefined) throw new Error('You must set a value when using setItem(key, value)');
      return localStorage[key] = value;
    };
    this['removeItem'] = function(key){
      return localStorage.removeItem(key);
    };
    this['length'] = function(){
      return localStorage.length;
    };
  };

  var StorageWrapper = function(){
    if ( !(this instanceof arguments.callee) ) return new StorageWrapper();
    (global['localdStorage'] && prepare_local || prepare_cookie).call(this);
  };

  global['tastyStorage'] = StorageWrapper();

})(this, this.document, JSON);
