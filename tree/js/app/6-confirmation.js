//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	Confirmation	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@		cnfr
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