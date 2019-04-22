//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	General		@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	gnl
function isObject (v) {
	return ( Object.prototype.toString.call(v) === "[object Object]" ) ? true : false;
}
function isArray (v) {
	return ( Object.prototype.toString.call(v) === "[object Array]" ) ? true : false;
}