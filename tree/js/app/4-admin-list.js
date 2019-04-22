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