var a = (function () {
/**
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%	vars		%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
**/
var currentUser,
	currentUsername,
	treeStructure,
	isTreeLoaded = false,
	isTreeModified = false,
	
	fullPriv = {
		groups: {
			forView: [],
			forSend: []
		},
		users: {
			forView: [],
			forSend: []
		}
	},
	halfPriv = {
		groups: {
			forView: [],
			forSend: []
		},
		users: {
			forView: [],
			forSend: []
		}
	};
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	General		@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	gnl
function isObject(v) {
	return Object.prototype.toString.call(v) === "[object Object]";
}
function isArray(v) {
	if ( typeof Array.isArray === 'function' ) {
		return Array.isArray(v);
	} else {
		return Object.prototype.toString.call(v) === "[object Array]";
	}
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	Profile		@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	pfl

//------------------------------------------------------------------------------------------------------------------------------------------------------	public    updateProfile
function updateProfile(user) {
	var tmp = atob( user.ldap_dn.slice(0, -3) );
	//console.log(tmp);
	//console.log(user.ldap_sn);
	
	var nameRow;
	Base64.decode( user.ldap_dn ).split(',').forEach(function (i) {
		if ( i.slice(0, 3) === 'CN=' ) {
			nameRow = i.slice(3);
			return;
		}
	});
	var fullname = nameRow.split(' - '),
		firstname = fullname[1];
		lastname = fullname[0];
	// atob		->		Base64.decode	
	$('#fn-profile-img').attr({ src: 'http://100.80.0.175' + user.photo });
	$('#fn-profile-firstname').html( firstname ); // Base64.decode( user.ldap_givenname )
	$('#fn-profile-lastname').html( lastname ); // Base64.decode( user.ldap_sn.slice(0, -1) )
	$('#fn-profile-email').html(  user.email );
	$('#fn-profile-title').html( Base64.decode( user.ldap_title ) );
	$('#fn-profile-phone').html(  user.number );
}
function setGenVars(user) {
	var fullName = atob( user.ldap_givenname ) +' '+ atob( user.ldap_sn.slice(0, -1) );
	currentUser = fullName
	currentUsername = user.username;
	//console.log(user);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------	public    makeAutocomplete
function makeAutocomplete (divId) {
	$('#'+divId).autocomplete({
		source: function ( request, response ) {
			$.ajax({
				url: "http://100.80.0.175/cgi-bin/cpni",
				dataType: "json",
				data : {
					action: 'AcUsername',
					session: 'abc',
					str: request.term
				}
			}).done(function ( data ) {
				var arrList = [],
					key = '';
				for ( key in data[0] ) {
					arrList.push(key);
				}
				response( arrList ); // response( data[0] ); 
			}).fail(function (data, errorTitle, errorDetail) {
				alertify.error('AcUsername failed<br />'+errorTitle+'<br />'+errorDetail);
			});
		},
		select: function ( event, ui ) {
			//$('#users_list').empty();
			//$('#users_list').append( $.parseHTML('<li class="list-group-item btn btn-default btn-lg"><a href="#">'+ui.item.value+'</a></li>') );
			$.ajax({
				url : 'http://100.80.0.175/cgi-bin/cpni',
				type : 'GET',
				dataType : 'json',
				data : {
					action: 'GetUserInfo',
					session: 'abc',
					username: ui.item.value
				},
				beforeSend: function () {
					$('.fn-treetoolbar').addClass('disabled');
				}
			})
			.done(function ( data, textStatus, jqXHR ) {
				var user = data[0][ui.item.value];
				setGenVars(user);
				updateProfile(user);
				loadTrees();
			}).fail(function (data, errorTitle, errorDetail) {
				alertify.error('AcUsername failed<br />'+errorTitle+'<br />'+errorDetail);
			});
		}
	});
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	Admin List  	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@		adls

//----------------------------------------------------------------------------------------------------------------------------------------------------------	public    adminEvt
function adminEvt() {
	$('#fn-update_admin_list').on('click', function () {
		if ( $(this).hasClass('disabled') ) { return; }
		
		$.ajax({
			url : 'http://100.80.0.175/cgi-bin/cpni',
			type : 'GET',
			dataType : 'json',
			data : {
				action: 'GetUsersWithAdminAccess',
				session: 'abc',
				type: 'counter'
			},
			beforeSend : function () {
				$('#fn-update_admin_list').addClass('disabled');
			}
		})
		.done(function ( data, textStatus, jqXHR ) {
			//if (  !data[0]['taslimi-p'] ) { alert('data came back messed up'); }
			var obj = data[0],
				arr = [],
				html = '';
			for (var prop in obj) {
				if ( obj.hasOwnProperty(prop) ) {
					arr.push(obj[prop]);
				}
			}
			arr.forEach(function (item) {
				/*
				html +=	'<li>';
				html +=		'<button class="btn btn-default btn-xs col-md-8 ma-grads-btn-main ma-mrgnbtm-05em fn-adminlist-item" data-username='+item.username+'>';
				html +=			atob( item.ldap_givenname ) +' '+ atob( item.ldap_sn.slice(0, -1) );
				html +=		'</button>';
				html +=	'</li>';;
				*/
				html +=	'<tr>';
				html +=		'<td class="btn btn-default btn-sm col-md-12 fn-adminlist-item" data-username='+item.username+'>';
				html +=			atob( item.ldap_givenname ) +' '+ atob( item.ldap_sn.slice(0, -1) );
				html +=		'</td>'
				html +=	'</tr>';
				
			});
			$('#fn-update_admin_list').removeClass('disabled');
			$('#fn-admin_list').html(html);
		})
		.fail(function ( data, errorTitle, errorDetail  ) {
			alertify.error('GetUsersWithAdminAccess failed<br />'+errorTitle+'<br />'+errorDetail);
			$('#fn-update_admin_list').removeClass('disabled');
		});
	});
	
	$('#fn-admin_list').on('click .fn-adminlist-item', function (e) {
		if ( $('.fn-adminlist-item').hasClass('disabled') ) { return; }
		//console.log($(e.target).data().username);
		$.ajax({
			url : 'http://100.80.0.175/cgi-bin/cpni',
			type : 'GET',
			dataType : 'json',
			data : {
				action: 'GetUserInfo',
				session: 'abc',
				username: $(e.target).data().username
			},
			beforeSend: function () {
				$('.fn-treetoolbar').addClass('disabled');
				$('.fn-adminlist-item').addClass('disabled');
			}
		})
		.done(function ( data, textStatus, jqXHR ) {
			$('.fn-adminlist-item').removeClass('disabled');
			var user = data[0][$(e.target).data().username];
			//var tmp = atob( user.ldap_dn.slice(0, -3) );
			setGenVars(user);
			updateProfile(user);
			loadTrees();
		})
		.fail(function (data, errorTitle, errorDetail) {
			alertify.error('GetUserInfo failed<br />'+errorTitle+'<br />'+errorDetail);
			$('.fn-adminlist-item').removeClass('disabled');
		});
	});
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	LoadTree	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	ldtr

//----------------------------------------------------------------------------------------------------------------------------------------------------------	private    useJstree
function useJstree (divId, treeStructure) {
	$.jstree.defaults.plugins = [
		//"grid"
		"checkbox"
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
	
	$('#'+divId).jstree({
		core : {
			//animation : 0,
			data : treeStructure
		},
		types : {
			"default" : {
				//"icon" : "jstree-icon jstree-file"
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
//------------------------------------------------------------------------------------------------------------------------------------------------------	private    getSelection
function getSelection(selected, treeId) {
	if ( !isArray(selected) ) { throw new Error('getSelection:  Argument is not an array.'); }
	
	var status = '',
		childless = [],
		withChild = [];
		
	var result = {
		counter: {
			groups: {
				forSend: [],
				forView: []
			},
			users: {
				forSend: [],
				forView: []
			}
		},
		record: {
			groups: {
				forSend: [],
				forView: []
			},
			users: {
				forSend: [],
				forView: []
			}
		},
		groupsAndUsers: []
	};
	if ( treeId === 'jstree_demo_div') {
		status = 'counter';
	} else if ( treeId === 'jstree_demo_div_2' ) {
		status = 'record';
	}
	/*
		2 ways to achive our goal:
		go through childless items and grab their parent and then see if all the childs of their parent is selected or not,
		if yes just select the parent, if not select all the siblings.
		
		go through withChild items and check all of their childs to see if they are select or not.
			if		item.children.length !== 0		&&		item.state.selected === true  
			groupList.push(item.id)
	*/
	selected.forEach(function (item) { // extract childless abd withChild node objects
		if (item.children.length === 0) { // childless node
			
			if (  $.inArray( item.text, childless ) === -1  ) { // item doesn't exists in our array
				childless.push(item);
				
			}
		} else if (item.children.length !== 0) { //idk(item);
			// item has child
			withChild.push(item);
		}
	});
	childless.forEach(function (item) {
		var parent = $('#'+treeId).jstree('get_node', item.parent);
		if ( parent.state.selected === false ) {
			//console.log(item);
			
			if ( status === 'counter' ) {
				result.counter.users.forSend.push(item.text);
				//result.counter.users.forView.push(item.text);
			} else if ( status === 'record' ) {
				result.record.users.forSend.push(item.text);
				//result.records.users.forView.push(item.text);
			}
			result.groupsAndUsers.push({
				text: item.text,
				icon: item.icon
			});
		}
	});
	// withChild	->		// [Object, Object, Object, Object]
	withChild.forEach(function (item) { // [Object,
		if ( item.children.length !== 0 && item.state.selected === true ) { // completely selected folder
			var parent = $('#'+treeId).jstree('get_node', item.parent);
			if ( parent.state.selected === false ) {
				if ( status === 'counter' ) {
					result.counter.groups.forSend.push(item.id);
					result.counter.groups.forView.push(item.text);
				} else if ( status === 'record' ) {
					result.record.groups.forSend.push(item.id);
					result.record.groups.forView.push(item.text);
				}
				result.groupsAndUsers.push(item.text);
			}
		}
	});
	//console.log(result.groupsAndUsers);
	return result;
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------	private    evt
function evt (mainTree, listTree) {
	var selected = [],
		result;
	
	var handler = function (e, node) {
		//console.log(e);
		//console.log(node);
		isTreeModified = true;
		
		if ( $(e.target).hasClass('jstree-anchhor') || $(e.target).hasClass('jstree-checkbox') ) {
			
			if ( isTreeModified ) {
				$('#fn-'+mainTree+'-give_access').removeClass('disabled');
			} else if ( !isTreeModified ) {
				$('#fn-'+mainTree+'-give_access').addClass('disabled');
			}
		}
	}
	$('#'+mainTree).on('click #'+mainTree, handler); // select_node.jstree
	//$('#'+mainTree).on('click #jstree_demo_div_2', handler); //  deselect_node.jstree
	
	$('#'+mainTree).on('ready.jstree', function (e, data) {
		//$('.fn-'+mainTree+'-treetoolbar').removeClass('disabled');
	});
	$('#'+mainTree).on("changed.jstree", function (e, data) {
		
		/*	make give access button disable if nothing is selected
		
		if ( $('#'+mainTree).jstree('get_selected', ['full']).length === 0 ) {
			$('#fn-'+mainTree+'-give_access').addClass('disabled');
		} else {
			$('#fn-'+mainTree+'-give_access').removeClass('disabled');
		}
		*/

		selected = $( '#'+mainTree).jstree('get_selected', ['full'] );
		result = getSelection( selected, mainTree );
		
		fullPriv.groups.forSend = result.counter.groups.forSend;
		fullPriv.groups.forView = result.counter.groups.forView;
		fullPriv.users.forSend = result.counter.users.forSend;
		halfPriv.groups.forSend = result.record.groups.forSend;
		halfPriv.groups.forView = result.record.groups.forSend;
		halfPriv.users.forSend = result.record.users.forSend;
		
		$('#'+listTree).remove();
		$('#fn-'+listTree+'-parent').append( $.parseHTML('<div id="'+listTree+'" class="col-md-2 text-right"></div>') );
		$('#'+listTree).jstree({
			core : {
				data : result.groupsAndUsers
			}
		});
	});
	
	$('#fn-'+mainTree+'-open_all').on('click', function () {
		if ( !$(this).hasClass('disabled') ) {
			$('#'+mainTree).jstree(true).open_all();
		}
	});
	$('#fn-'+mainTree+'-close_all').on('click', function () {
		if ( !$(this).hasClass('disabled') ) {
		$('#'+mainTree).jstree(true).close_all();
		}
	});
	$('#fn-'+mainTree+'-select_all').on('click', function () {
		if ( !$(this).hasClass('disabled') ) {
			$('#'+mainTree).jstree(true).select_all();
		}
	});
	$('#fn-'+mainTree+'-deselect_all').on('click', function () {
		if ( !$(this).hasClass('disabled') ) {
			$('#'+mainTree).jstree(true).deselect_all();
		}
	});
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------	private    reCheck
function extractForRecheck (obj) {
	if ( !isObject(obj) ) { throw new Error('extractForRecheck:  Argument is not an object.'); }
	var counters = [],
		records = [];
	
	obj.counters.users.forEach(function (item) {
		if ( typeof item !== 'undefined' && typeof item === 'string') {
			counters.push(item);
		}
	});
	obj.counters.groups.forEach(function (item) {
		if ( typeof item !== 'undefined' ) {
			counters.push(item);
		}
	});
	obj.records.users.forEach(function (item) {
		if ( typeof item !== 'undefined' ) {
			records.push(item);
		}
	});
	obj.records.groups.forEach(function (item) {
		if ( typeof item !== 'undefined' ) {
			records.push(item);
		}
	});
	return {
		counters: counters,
		records: records
	};
}
function reCheckHelper(divId, node) {
	// console.log(node);
	if ( !isObject(node) ) { throw new Error('reCheckHelper:  Argument is not an object.'); }
	
	if (node) {
		$('#'+divId).jstree(true).select_node(node.id, true, false); // 3true: closed,    3false:  opened
		/*if (node.parent === '#' && typeof node.parent === 'string') { // root node
			
			$('#'+divId).jstree(true).open_node(node.id);
			$('#'+divId).jstree(true).select_node(node.id, true, false);
			return;
			
		} else if (node.parent !== '#' && typeof node.parent === 'string') { // node that has a parrent
		
			//$('#'+divId).jstree(true).select_node(node.id, true, false);
			
			$('#'+divId).jstree(true).open_node(node.parent);
			// $('#'+divId).jstree(true).select_node(node.id, true, false);
			
			var node = $('#'+divId).jstree(true).get_node(node.parent, false);
			if ( !isObject(node) ) {
				reCheckHelper(node);
			}
		}*/
	}
}
function reCheck (divId, arr) {
	if ( !isArray( arr ) ) { throw new Error('reChekd:  Second argument is not an array.'); }
	
	$('#'+divId).jstree(true).deselect_all(); // true
	$('#'+divId).jstree(true).close_all(); // true
	arr.forEach(function (item) {
		if (typeof item === 'string') {
			reCheckHelper( divId, $('#'+divId).jstree(true).get_node(item, false) );
		}
	});
	isTreeModified = false;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------	private    loadTree
function loadTrees () {
	
	if ( isTreeLoaded === false ) {
		
		isTreeLoaded = true;
		
		$('#jstree_demo_div').remove();
		$('#fn-jstree_demo_div-parent').append( $.parseHTML('<div id="jstree_demo_div" class="col-md-2 text-right"></div>') );
		$('#jstree_demo_div_2').remove();
		$('#fn-jstree_demo_div_2-parent').append( $.parseHTML('<div id="jstree_demo_div_2" class="col-md-2 text-right"></div>') );
		//$('body').css({background: '#E7F2AE'});
		
		$.ajax({
			url : 'http://100.80.0.175/cgi-bin/cpni',
			type : 'GET',
			dataType : 'json',
			data : {
				action: 'Getgroups',
				session: 'abc',
				base: '0',
				version: '2'	// 1= without icon	2= with icon
			}
		})
		.done(function (a,b,c) {
			// console.log(a);
			// console.log(b);
			// console.log(c);
			treeStructure = a[0];
			useJstree('jstree_demo_div', treeStructure);
			useJstree('jstree_demo_div_2', treeStructure);
			
			$.ajax({
				url : 'http://100.80.0.175/cgi-bin/cpni',
				type : 'GET',
				dataType : 'json',
				data : {
					action: 'GetMyAdminAccessList',
					session: 'abc'
				}
			})
			.done(function (data) {
				var myAccessList = extractForRecheck( data[0] );
				reCheck('jstree_demo_div', myAccessList.counters);
				reCheck('jstree_demo_div_2', myAccessList.records);
				$('.fn-treetoolbar').removeClass('disabled');
				
			})
			.fail(function ( data, errorTitle, errorDetail ) {
				alertify.error('GetMyAdminAccessList failed<br />'+errorTitle+'<br />'+errorDetail);
			});
		})
		.fail(function ( data, errorTitle, errorDetail ) {
			alertify.error('Getgroups failed<br />'+errorTitle+'<br />'+errorDetail);
		});
		
		evt('jstree_demo_div', 'jstree_demo_div_3');
		evt('jstree_demo_div_2', 'jstree_demo_div_4');

	} else if ( isTreeLoaded === true ) {
		$.ajax({
			url: 'http://100.80.0.175/cgi-bin/cpni?',
			type: 'GET',
			dataType: 'json',
			data: {
				action: 'GetUserAdminAccessList',
				session: 'abc',
				admin: currentUsername
			}
		})
		.done(function (a, b, c) {
			var rdyData = extractForRecheck( a[0] );
			reCheck('jstree_demo_div', rdyData.counters);
			reCheck('jstree_demo_div_2', rdyData.records);
		});
	}
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	Confirmation	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@		cnfr
var confirmationTTT = (function () {
	function bind () {
		
	}
	function handler () {
		
	}
	
	return function () {
		//
	};
}());
//----------------------------------------------------------------------------------------------------------------------------------------------------------	private    confirmation
function confirmation(mod, groups, users) {
	var title,
		message = '';
	if ( mod === 'full' ) {
		title = 'تغییر دسترسی کانترها';
	} else if (mod === 'half') {
		title = 'تغییر دسترسی رکورد ها';
	}
	message += 'شما می خواهید ';
	if ( (groups.length === 1 && users.length === 0) || (groups.length === 0 && users.length === 1) ) {
		message += 'دسترسی ';
	} else {
		message += 'دسترسی های ';
	}
	message += 'زیر را به ';
	message += '<b>'+currentUser+'</b> ';
	message += 'بدهید:';
	message += '<br /><br />';
	if (users.length !== 0 && groups.length === 0) {
		message += 'کاربران :';
		message += '<br /><br />';
		message += users.join('    <br />    ');
	} else if (groups.length !== 0 && users.length === 0) {
		message += 'پوشه ها :';
		message += '<br /><br />';
		message += groups.join('<br />');
	} else if ( groups.length !== 0 && users.length !== 0 ) {
		message += 'کاربران :';
		message += '<br /><br />';
		message += users.join('<br />');
		message += '<br /><br />';
		message += 'پوشه ها :';
		message += '<br /><br />';
		message += groups.join('<br />');
	}
	bbox({
		title: title,
		message: message,
		btns: {
			success: {
				label: 'انجام بده',
				className: "btn-primary",
				callback: function () {
					var users,
						groups;
					if ( mod === 'full') {
						users = fullPriv.users.forSend.join(',');
						groups =  fullPriv.groups.forSend.join(',');
					} else if ( mod === 'half' ) {
						users = halfPriv.users.forSend.join(',');
						groups =  halfPriv.groups.forSend.join(',');
					}
					$.ajax({
						url : 'http://100.80.0.175/cgi-bin/cpni',
						type : 'GET',
						dataType : 'json',
						data : {
							action: 'SetUserAdminAccessList',
							session: 'abc',
							admin: currentUsername,
							type: (mod === 'full') ? 'counter' : 'record',
							users: users || '',
							groups: groups || ''
						},
					}).done(function ( data, textStatus, jqXHR ) {
						
						var status = '', // 'error' || 'success'
							message = '';
						
						if ( data[0].result === 'accesses set successfully!' ) {
							status = 'success'
						} else if ( data[0].error_msg ) {
							status = 'error'
						}
						
						if ( status === 'success' ) {
							message = 'تغییر دسترسی با موفقیت انجام شد.';
							message += '<br />';
							message += 'پیام سرور: ';
							message += '<br />';
							message += data[0].result;
						} else if ( status === 'error' ) {
							message = 'تغییر دسترسی شکست خورد.';
							message += '<br />';
							message += 'پیام سرور: ';
							message += '<br />';
							message += data[0].error_msg;
						}
						alertify[status](message);
						/*
						a.bbox({
							message: message,
							btns: {
								success: {
									label: 'باشه',
									className: 'btn-primary'
								}
							}
						});
						*/
						
					}).fail(function ( data, errorTitle, errorDetail ) {
						alertify.error('SetUserAdminAccessList failed<br />'+errorTitle+'<br />'+errorDetail);
					});
				}
			},
			"Danger!": {
				label: 'برگرد',
				className: "btn-default",
				callback: function () {
					
				}
			
			}
		}
	});
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------	public    confirmEvt

function confirmEvt() {
	$('#fn-jstree_demo_div-give_access').on('click', function () {
		if ( !$(this).hasClass('disabled') ) {
			a.confirmation('full', a.fullPriv.groups.forView, a.fullPriv.users.forSend);
		}
		
	});
	$('#fn-jstree_demo_div_2-give_access').on('click', function () {
		if ( !$(this).hasClass('disabled') ) {
			a.confirmation('half', a.halfPriv.groups.forView, a.halfPriv.users.forSend);
		}
	});
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------	public    bbox
function bbox (o) {
	bootbox.dialog({
		title: o.title,
		message: o.message,
		show: true,
		backdrop: true,
		animate: true,
		onEscape: function () {
			
		},
		buttons: o.btns
	});
}
/**
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%		rtn		%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
**/
var t = (function () {
	var s = 'salam';
	return function () {
		console.log(s);
	}
}())
return {
	t: t,
	// props:
	treeStructure: treeStructure,
	fullPriv: fullPriv,
	halfPriv: halfPriv,
	
	// methods:
	isObject: isObject,
	isArray: isArray,
	
	makeAutocomplete: makeAutocomplete,
	
	loadTrees: loadTrees,
	
	updateProfile: updateProfile,
	
	adminEvt: adminEvt,
	
	setGenVars: setGenVars,
	
	confirmation: confirmation,
	confirmEvt: confirmEvt,
	
	bbox: bbox,
	
	reCheck: reCheck
};

}());
