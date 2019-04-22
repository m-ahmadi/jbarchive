//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	Profile		@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@	pfl
//------------------------------------------------------------------------------------------------------------------------------------------------------	public    updateProfile
function updateProfile(user) {
	var tmp = atob( user.ldap_dn.slice(0, -3) );
	//console.log(tmp);
	//console.log(user.ldap_sn);
	
	$('#fn-profile-img').attr({ src: user.photo });
	$('#fn-profile-firstname').html( atob( user.ldap_givenname )  );
	$('#fn-profile-lastname').html( atob( user.ldap_sn.slice(0, -1) ) );
	$('#fn-profile-email').html(  user.email );
	$('#fn-profile-title').html( atob( user.ldap_title ) );
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
				response(data[0])
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