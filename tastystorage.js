// step 1: figure out if localstorage is supported
//   step 1a: if not, create cookie parser
// step 2: create wrapper methods for setting localstorage properties
// step 3?: get to work with sessionstore?


(function(global, document){
  var prepare_cookie = function(){
    var SPOILED = ';expires=Tue, 13 Aug 1985 07:30:00 UTC';
        var encode = function(object){};
    var decode = function(string){};
    var retrieve = function(){};
    var store = function(){};
    this.interface = 'document.cookie';
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

})(this, this.document);
