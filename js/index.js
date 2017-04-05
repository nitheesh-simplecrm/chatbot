$(function() {

	// chat aliases
	var you = 'You';
	var robot = 'SimpleCRM';
	
	// slow reply by 400 to 800 ms
	var delayStart = 400;
	var delayEnd = 800;
	
	// initialize
	var bot = new chatBot();
	var chat = $('.chat');
	var waiting = 0;
	$('.busy').text(robot + ' is typing...');
	
	// submit user input and get chat-bot's reply
	var submitChat = function() {
	
		var input = $('.input input').val();
		if(input == '') return;
		$('.input input').val('');
		updateChat(you, input);
		
		var reply = bot.respondTo(input);
		if(reply != 'fail'){
		
		var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
			$('.busy').css('display', 'block');
			waiting++;
			setTimeout( function() {
				if(typeof reply === 'string') {
					updateChat(robot, reply);
				} else {
					for(var r in reply) {
						updateChat(robot, reply[r]);
					}
				}
				if(--waiting == 0) $('.busy').css('display', 'none');
			}, latency);
		}else{
			$.ajax({
			url:'qa.php',
			method:'post',
			async:false,
			data:{input:input},
			success:function(data){
			
			reply = data;
			var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
			$('.busy').css('display', 'block');
			waiting++;
			setTimeout( function() {
				if(typeof reply === 'string') {
					updateChat(robot, reply);
				} else {
					for(var r in reply) {
						updateChat(robot, reply[r]);
					}
				}
				if(--waiting == 0) $('.busy').css('display', 'none');
			}, latency);
		}
		});
		}

		
	}
	
	// add a new line to the chat
	var updateChat = function(party, text) {
	
		var style = 'you';
		var line = $('   <div class="row msg_container base_sent">                        <div class="col-md-10 col-xs-10">                          <div class="messages msg_sent">                                <p>'+text+'</p>                         </div>                        </div>                        <div class="col-md-2 col-xs-2 avatar">                            <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">                        </div>                    </div>');
		if(party != you) {
			style = 'other';
			var line = $('<div class="row msg_container base_receive">                        <div class="col-md-2 col-xs-2 avatar">                            <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">                        </div>                        <div class="col-md-10 col-xs-10">                            <div class="messages msg_receive">                                <p>'+text+'</p>                            </div>                        </div>                    </div>');
		}
		
		
		// line.find('.party').addClass(style).text(party + ':');
		//line.find('.text').text(text);
		
		chat.append(line);
		
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	
	}
	
	// event binding
	$('.input').bind('keydown', function(e) {
		if(e.keyCode == 13) {
			submitChat();
		}
	});
	$('.input a').bind('click', submitChat);
	
	// initial chat state
	updateChat(robot, 'Hi there. Try typing something!');

});