(function() {
  var main;

  main = {};

  main = (function() {
    var init;
    init = function() {
      return console.log("initialize");
    };
    return {
      init: init
    };
  })();

  main.init();

}).call(this);
