if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

$.support.cors = true;

$.ajaxSetup({
	crossDomain: true
});



var tree;





function jt(struc) {
	$.jstree.defaults.plugins = [
		//"grid",
		"checkbox",
		// "contextmenu", 
		// "dnd", 
		// "massload", 
		// "search", 
		// "sort", 
		// "state", 
		// "types", 
		// "unique", 
		// "wholerow", 
		// "changed", 
		// "conditionalselect"
	];
	$('#tree').jstree({
		core : {
			//animation : 0,
			data : struc
		},
		types : {
			"default" : {
				//"icon" : "glyphicon glyphicon-hdd",
				"disabled" : { 
					"check_node" : false, 
					"uncheck_node" : false 
				}
			},
			"demo" : {
			}
		}
	});
	
}
$(function () {
	
	$.ajax({
		url:'t.json',
		type: 'GET',
		dataType: 'json'
	}).done(function (data) {
		jt(data);
	});
	
	
		
		
	
	$('.a').on('click', function (e) {
		console.log(e);
	});
	
});




/*$.ajax({
	url: 'http://185.4.29.188/cgi-bin/cpni?action=GetUserInfo&session=abc',
	type: 'GET',
	dataType: 'json'
})
.done(function (data) {
	alert('success');
})
.fail(function (a, b, c) {
	console.log(a);
	console.log(b);
	console.log(c);
});
*/