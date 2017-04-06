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

	// setChatHistory
	// var visitor_id = 2147483647;
	var visitor_id = $.cookie("userId"); // getting cookie value

	$.ajax({
		url:'savechat.php',
		method:'post',
		async:false,
		data:{
			call_type:'setChatHistory',
			visitor_id:visitor_id
		},
		success:function(data){

	    	if (data.trim() == 'no results') {
 				
				// initial chat state
				//var line = $('<div class="row msg_container base_receive">                        <div class="col-md-2 col-xs-2 avatar">                            <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">                        </div>                        <div class="col-md-10 col-xs-10">                            <div class="messages msg_receive">                                <p>'+'Hi there, please type something...'+'</p>                            </div>                        </div>                    </div>');
				//chat.append(line);
				//chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	    	}
	    	else{
	
				var objData = jQuery.parseJSON(data);
				$.each(objData , function(i, val) {

				  var ai_answer = objData [i].ai_answer;
				  var ai_question = objData [i].ai_question;
				  var timestamp = objData [i].timestamp;
				  var unix_timestamp = objData [i].unix_timestamp;
				  var user_id = objData [i].user_id;

				  console.log(ai_answer);
				  console.log(ai_question);
				  console.log(timestamp);
				  console.log(unix_timestamp);
				  console.log(user_id);
				  console.log('===================================================');

				// append question
				var line = $('   <div class="row msg_container base_sent">                        <div class="col-md-10 col-xs-10">                          <div class="messages msg_sent">                                <p>'+ai_question+'</p>                         </div>                        </div>                        <div class="col-md-2 col-xs-2 avatar">                            <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">                        </div>                    </div>');
				chat.append(line);
				chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});

				// append answer
				var line = $('<div class="row msg_container base_receive">                        <div class="col-md-2 col-xs-2 avatar">                            <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">                        </div>                        <div class="col-md-10 col-xs-10">                            <div class="messages msg_receive">                                <p>'+ai_answer+'</p>                            </div>                        </div>                    </div>');
				chat.append(line);
				chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});

				});		

	    	}
		}
	});
	
	// submit user input and get chat-bot's reply
	var submitChat = function() {
		$('.busy').css('display', 'block');
		var input = $('.input input').val();
		var accessToken = "cf16e17403a946c8851dfd1d7515683b";
        var baseUrl = "https://api.api.ai/v1/";
		if(input == '') return;
		$('.input input').val('');
		updateChat(you, input);
		
        $.ajax({
            type: "POST",
            url: baseUrl + "query?v=20150910",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({ query: input, lang: "en", sessionId: "somerandomthing" }),
            success: function(data) {
                console.log(data.result.fulfillment.speech);
                // setResponse(data.result.fulfillment.speech);
                updateChat(robot, data.result.fulfillment.speech);

				// save chat history in db
				var api_answer = data.result.fulfillment.speech;
				console.log('api_answer : '+api_answer);
				var visitor_id = $.cookie("userId"); // getting cookie value
				$.ajax({
					url:'savechat.php',
					method:'post',
					async:false,
					data:{
						api_question:input,
						api_answer:api_answer,
						visitor_id:visitor_id,
						call_type:'saveChatHistory'
					},
					success:function(data){
		            	console.log('final result : '+data);
					}
				});

                $('.busy').css('display', 'none');
            },
            error: function() {
                setResponse("Internal Server Error");
            }
        });

		// var reply = bot.respondTo(input);
		// if(reply != 'fail'){
		
		// var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
		// 	$('.busy').css('display', 'block');
		// 	waiting++;
		// 	setTimeout( function() {
		// 		if(typeof reply === 'string') {
		// 			updateChat(robot, reply);
		// 		} else {
		// 			for(var r in reply) {
		// 				updateChat(robot, reply[r]);
		// 			}
		// 		}
		// 		if(--waiting == 0) $('.busy').css('display', 'none');
		// 	}, latency);
		// }else{

		// 	$.ajax({
		// 	url:'qa.php',
		// 	method:'post',
		// 	async:false,
		// 	data:{input:input},
		// 	success:function(data){
			
		// 	reply = data;
		// 	var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
		// 	$('.busy').css('display', 'block');
		// 	waiting++;
		// 	setTimeout( function() {
		// 		if(typeof reply === 'string') {
		// 			updateChat(robot, reply);
		// 		} else {
		// 			for(var r in reply) {
		// 				updateChat(robot, reply[r]);
		// 			}
		// 		}
		// 		if(--waiting == 0) $('.busy').css('display', 'none');
		// 	}, latency);
		// }
		// });
		// }

		
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
	// updateChat(robot, 'Hi there. Try typing something!');

});