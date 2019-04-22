//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
$('#jstree_demo_div').jstree({
	core : {
	//animation : 0,
		data : {
			url: 'http://100.80.0.175/cgi-bin/cpni',//'alternate_4.json',//'users_groups.json',//'alternate_5.json',//'iddar.json', // 'http://100.80.0.175/cgi-bin/cpni',
			type: 'GET',
			dataType : "json",
			data: {
				action: 'Getgroups',
				session: 'abc',
				base: '0',
				version: '2'	// 1= without icon	2= with icon
			},
			beforeSend: function () {
				
			},
			success: function (a, b, c) {
				// console.log(a);
				// console.log(b);
				// console.log(c);
				treeStructure = a[0];
				createTree2(treeStructure);
				$('.fn-treetoolbar').removeClass('disabled');
				
			},
			error: function (a, b, c) {
				console.log(a);
				console.log(b);
				console.log(c);
				alert('خطا در ارتباط با سرور');
			},
			complete: function () {
			}
		}
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
/*
http://100.80.0.175/cgi-bin/cpni?action=GetUserAdminAccessList&session=abc&admin=taslimi-p
http://100.80.0.175/cgi-bin/cpni?action=getgroups&session=abc&base=0&version=1 (without icon)
http://100.80.0.175/cgi-bin/cpni?action=getgroups&session=abc&base=0&version=2 (with icon)
http://100.80.0.175/cgi-bin/cpni?action=Getgroups&session=abc&base=0&version=2
http://100.80.0.175/cgi-bin/cpni?action=GetUserInfo&session=abc&groupid=273
http://100.80.0.175/cgi-bin/cpni?action=GetUserInfo&session=abc&username=asadi-f
http://100.80.0.175/cgi-bin/cpni?action=AcUsername&session=abc&str=ta
http://10.255.135.92/cgi-bin/cpni?action=AcUsername&session=abc&str=ta
http://100.80.0.175/cgi-bin/cpni?action=ResetUserViewAccess&users=heydari,mojabi&groups=124,143,512
http://100.80.0.175/cgi-bin/cpni  => http://100.80.0.175/cgi-bin/cpni
*/
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
childless.forEach(function (item) {
	var parent = $('#jstree_demo_div').jstree('get_node', item.parent);
	if ( parent.state.selected === false ) {
		//console.log(item);
		
		/*if ( $('#fn-full_priv').hasClass('active') === true ) {
			
			users.push(item.text + ' ' + '(کلی)');
			
		} else if ( $('#fn-short_priv').hasClass('active') === true ) {
			
			users.push(item.text + ' ' + '(جزیی)');
		}*/
		
		groupsAndUsers.push({
			text: item.text,
			icon: item.icon
		});
	}
});
// withChild	->		// [Object, Object, Object, Object]
withChild.forEach(function (item) { // [Object,
	if ( item.children.length !== 0 && item.state.selected === true ) { // completely selected folder
		var parent = $('#jstree_demo_div').jstree('get_node', item.parent);
		if ( parent.state.selected === false ) {
			/*if ( $('#full_priv').hasClass('active') === true ) {
				groups.push(item.text + ' ' + '(کلی)');
				
			} else if ( $('#short_priv').hasClass('active') === true ) {
				groups.push(item.text + ' ' + '(جزیی)');
			}*/
			groupsAndUsers.push(item.text);
			return undefined;
		} else {
		}
		//console.log('1 item was added to the groups array');
	}
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function action () {
	if (state === true) {
		//remove
		state = false;
		$('body').css({background: 'wheat'});
		$(this).html('به روز رسانی');
		$('.fn-treetoolbar').addClass('disabled');
		$('#profile').val('');
		$('#jstree_demo_div').remove();
		$('#tree_parent').append( $.parseHTML('<div id="jstree_demo_div" class="col-md-2 pull-right"></div>') );
	} else if (state === false) {
		//load
		state = true;
		$('body').css({background: '#E7F2AE'});
		$(this).html('حذف');
		a.tree();
		a.evt();
	}
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//http://100.80.0.175/cgi-bin/cpni?action=getgroups&session=abc&base=0&version=1 (without icon)
//http://100.80.0.175/cgi-bin/cpni?action=getgroups&session=abc&base=0&version=2 (with icon)
url: 'alternate_4.json',//'users_groups.json',//'alternate_5.json',//'iddar.json', // 'http://100.80.0.175/cgi-bin/cpni',
type: 'GET',
dataType : "json",
//data: 'cation=getgroups&session=abc&base=0&tree=1',//{sd: encodeURIComponent('salam'), ss: 'bbuye'},
//data: 'action=getgroups&session=abc&base=0&version=2'
//data: 'action=add_access&items[]=ali&items[]=hasan'
//data: 'action=DelUserViewAccess&items[]=ali&items[]=hasan'
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
core : {
	data : {
		success: function () {
			/*a[0].forEach(function (item) {
				if ( item.hasOwnProperty('id') ) {
				} else if ( !item.hasOwnProperty('id') ) {
					//item.icon = "jstree-file";
				}
				//item.data = {
				//	chbx: '<input type="checkbox" class="treegrid-chbx">'
				//}
			});*/
		}
	}
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
grid: {
	//width: 200,
	columns: [
		{
			header: 'نام',
			headerClass: 'text-center'
		},
		{
			header: 'دسترسی جزیی',
			columnClass: 'text-center',
			value: function (a) {
				console.log(a);
				return a.data.chbx;
			}
		},
		{
			header: 'دسترسی کلی',
			columnClass: 'text-center',
			value: 'chbx'
		}
	]
},
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function murderThem(arr) { // [Object, Object, Object, Object]
	arr.forEach(function (item) { // [Object,
		if ( ) { // completely selected folder
		}/* else if ( item.children.length !== 0 && item.state.selected === false) { // not completely selected folder
				var fullItems = [];
				item.children.forEach(function (item) { // go through this not completely selected folder
					fullItems.push(  $('#jstree_demo_div').jstree('get_node', item)  );
				});
				
				fullItems.forEach(function (item) {
					console.log(item);
					if ( item.children.length !== 0 && item.state.selected === false ) {
						
					} else if ( fullItems.children.length === 0 ) { // if it's a file
						
						
						
					} else  if (item.children.length !== 0) {
						
						murderThem(item.children);
					}
					
				});
				console.log(item);
		}*/
	});
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
withChild.forEach(function (item) {
	if ( item.children.length !== 0 && item.state.selected === true ) { // completely selected folder
		groups.push(item.id);
		
		
		
		
	} else if ( item.children.length === 0 && item.state.selected === false ) { // not complete selected folder
		
		item.children.forEach(function (item) {
			if (  ) {
				
			}
		});
	}
	*/
	
	
	if (item.children.length !== 0) {
		var title = item.text;
		var valid = true;
		
		item.children.forEach(function (item) {
			
			if ( item.charAt(0) !== 'j' ) {
				valid = false
			}
		});
		if (valid === true) {
			finalArr.push(title);
		}
		
	}
	
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
$('#profile').val( childless.join('\n') );
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function idk (item) { // ite === selected node that has children
	// item has at least one child
	var cond = false,
		firstNode = item.children;
		
	for (prop in obj) {
		if ( Object.prototype.hasOwnProperty.call(obj, prop) ) { // general check for iterating through not inherited members
			if ( Object.prototype.toString.call(prop) === "[object Object]" ) { // if property is an object (is object)
			
				if ( Object.prototype.toString.call(prop.children) === "[object Array]" && prop.children.length !== 0  ) { // if .children is array and not empty (has child)
					
				}
			} else if () {
				
			}
		}
	}
	
	if ( firstNode.children.length === 0 ) {
		
	} else if ( firstNode.children.length !== 0 ) {
		
	}
	
	
	if (cond === true) {
		idk(node);
	}
	return result;
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@