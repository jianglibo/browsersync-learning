var sum = require('./m1');
var xmlhttprequestShim = require('../shims/xmlhttprequest');

xmlhttprequestShim();
alert(sum(3, 4));
