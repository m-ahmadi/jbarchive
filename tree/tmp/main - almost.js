$(function () {
	// var input = document.getElementById("autocomplete_1");//$('#autocomplete_1').eq(0),
		// awesomplete = new Awesomplete(input);
	// awesomplete.list = ["Ada", "Java", "JavaScript", "Jambo", "Jamming", "Jam", "Jamal", "Janueary", "JaSON", "Jarvis", "JaTS", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"];
	
	
	$.jstree.defaults.plugins = [
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
	
	// $('#jstree_demo_div').jstree();

	// $('#jstree_demo_div').on("changed.jstree", function (e, data) {
  		// console.log(data.selected);
	// });

	var state = false;
	
	$('#button').on('click', function () {
		if (state === true) {
			//remove
			state = false;
			
			$('body').css({background: 'wheat'});
			$(this).html('به روز رسانی');
			$('.opt-btns').addClass('disabled');
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
	});
	
	
	
	$('#open_all').on('click', function () {
		$("#jstree_demo_div").jstree("open_all");
	});
	$('#close_all').on('click', function () {
		$("#jstree_demo_div").jstree("close_all");
	});
	$('#select_all').on('click', function () {
		$("#jstree_demo_div").jstree("select_all");
	});
	$('#deselect_all').on('click', function () {
		$("#jstree_demo_div").jstree("deselect_all");
	});
	
	
});








var mo;

var a = (function  () {

function tree () {
	
	$('#jstree_demo_div').jstree({
		core : {
			//animation : 0,
			data : {
				
				url: 'alternate_4.json',//'iddar.json', // 'http://100.80.1.176/cgi-bin/cpni',
				type: 'GET',
				dataType : "json",
				//data: 'action=getgroups&session=abc&base=0&tree=1',//{sd: encodeURIComponent('salam'), ss: 'bbuye'},
				//data: 'action=getgroups&session=abc&base=0&tree=0'
				//data: 'action=add_access&items[]=ali&items[]=hasan'
				//data: 'action=DelUserViewAccess&items[]=ali&items[]=hasan'
				
				//data: 'action=ResetUserViewAccess&users=heydari,mojabi&groups=124,143,512'
				
				beforeSend: function () {
					
				},
				success: function () {
					$('.opt-btns').removeClass('disabled');
					
				},
				error: function () {
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

}


function evt () {
	$('#jstree_demo_div').on('select_node.jstree', function (e, data) {
		
		//console.log(data);
	});
	
	$('#jstree_demo_div').on("changed.jstree", function (e, data) {
		var selected = [],
			childless = [],
			withChild = [];
		mo = data;
		
		selected = $('#jstree_demo_div').jstree('get_selected', ['full']);
		
		
		selected.forEach(function (item) { // extract childless abd withChild node objects
			if (item.children.length === 0) { // childless node
				
				if (  $.inArray( item.text, childless ) === -1  ) { // item doesn't exists in our array
					childless.push({
						text: item.text
						//children: item.children
					});
					
				}
			} else if (item.children.length !== 0) { //idk(item);
				// item has child
				withChild.push(item);
			}
		});
		var groups = [],
			users = [];
		/*
			2 ways to achive our goal:
			go through childless items and grab their parent and then see if all the childs of their parent is selected or not,
			if yes just select the paren, if not select all the siblings.
			
			go through withChild items and check all of their childs to see if they are select or not.
				if		item.children.length !== 0		&&		item.state.selected === true  
				groupList.push(item.id)
		*/
		childless.forEach(function (item) {
			users.push(item.text);
			console.log('1 item was added to the groups array');
		});
		
		
		function murderThem(arr) { // [Object, Object, Object, Object]
			
			arr.forEach(function (item) { // [Object,
			
				if ( item.children.length !== 0 && item.state.selected === true ) { // completely selected folder
				
					groups.push(item.id);
					console.log('1 item was added to the groups array');
					return undefined;
					
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
		console.log(withChild);
		murderThem(withChild);
		withChild.forEach(function (item) {
			
			/*
			if ( item.children.length !== 0 && item.state.selected === true ) { // completely selected folder
				groups.push(item.id);
				
				
				
				
			} else if ( item.children.length === 0 && item.state.selected === false ) { // not complete selected folder
				
				item.children.forEach(function (item) {
					if (  ) {
						
					}
				});
			}
			*/
			
			/*
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
			*/
		});
		
		$('#jstree_demo_div_2').remove();
		$('#secondtree-parent').append( $.parseHTML('<div id="jstree_demo_div_2" class="col-md-2 pull-right"></div>') );
		$('#jstree_demo_div_2').jstree({
			core : {
				data : groups
			}
		});
		//$('#profile').val( childless.join('\n') );
	});
}

function evt2 () {
	
	
}

return {
	tree: tree,
	evt: evt
	
};

}());























/*
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
*/