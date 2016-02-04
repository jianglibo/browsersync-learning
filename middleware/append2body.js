/**
 * @module
 */

module.exports = function append2body(req, res, next) {
  res.on('end', function(){
    console.log('ended.');
    res.write("abc");
  });
  next();
};
