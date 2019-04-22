 $("#login-button").click(function(event){
	event.preventDefault();
	
	
	var form = form = $('form[id="login-form"]'),
		uRdy=false,
		pRdy=false,
		username = $('#username'),
		password = $('#password'),
		submit = $('#login-button');
		uLength = username.val().trim().length,
		pLength = password.val().trim().length,
		color = 'red', // FFCACA
		aniDur = 500;
		
		
	function dis() {
		submit.prop('disabled', true);
		setTimeout(function(){ submit.prop('disabled', false); }, aniDur);
	}
	if (uLength < 4) {
		username.effect('highlight', {color: color}, aniDur);
		dis();
		uRdy=false;
		username[0].focus();
	} else {
		uRdy=true;
		if (!pRdy) { password[0].focus(); }
	}
	if (pLength < 6) {
		password.effect('highlight', {color: color}, aniDur);
		dis();
		pRdy=false;
		if (uRdy) { password[0].focus(); } else { username[0].focus(); }
	} else {
		pRdy=true;
		if (!uRdy) { username[0].focus(); }
	}
	
	if (uRdy && pRdy) {
		$('form').fadeOut(aniDur);
		$('.wrapper').addClass('form-success');
		$('#messages').append( $.parseHTML('<img src="images/ajax-loader.gif"/>') );
		//form.submit();
		//form[0].reset();
		
		$.ajax({
			url: 'http://10.255.148.60/cgi-bin/oauth2/authenticate?action=GetSalt&username=',
			type: 'POST',
			dataType: 'json',
			beforeSend : function () {
				
			}
		}).done(function () {
			
		}).fail(function () {
			
		});
		
		
	}
});