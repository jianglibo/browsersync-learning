// require the module as normal
var bs = require("browser-sync").create();

// .init starts the server
bs.init({
    server: "./app"
}, function() {
  setTimeout(function(){
    bs.notify("hhhhhhhhhhhh", 3000);
  }, 2000);
});

// Now call methods on bs instead of the
// main browserSync module export

// bs.watch('*.html').on('change', bs.reload);
 bs.watch('**/*.html').on('change', function(fn){
   bs.reload(fn);
 });
