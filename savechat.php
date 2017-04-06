<?php
class utils{

	protected $username;
	protected $password;
	protected $dbname;
	protected $hostname;
	protected $conn;

	public function __construct($username,$password,$dbname,$hostname){
		$this->username = $username;
		$this->password = $password;
		$this->dbname = $dbname;
		$this->hostname = $hostname;
		/*
		mysqli connect
		*/
		$this->conn = mysqli_connect($hostname,$username,$password,$dbname);
		if(mysqli_connect_errno()){
			echo 'Mysql connect error '.mysqli_connect_error();
			die();
		}
	}

	public function saveChat($api_question,$api_answer,$visitor_id){

        $current_timestamp  = strtotime("now");
		$api_answer   = mysqli_real_escape_string($this->conn,$api_answer);
		$api_question = mysqli_real_escape_string($this->conn,$api_question);
		$visitor_id   = mysqli_real_escape_string($this->conn,$visitor_id);
		$saveChat = "INSERT INTO conversation_log (ai_answer,ai_question,user_id,unix_timestamp) VALUES ('$api_answer','$api_question','$visitor_id','$current_timestamp')";
		mysqli_set_charset($this->conn, 'utf8');
		$saveChatHistory = mysqli_query($this->conn,$saveChat);

		return $saveChatHistory;
	}

	public function getChatHistory($visitor_id){

			$result = array();

		    $visitor_id   = mysqli_real_escape_string($this->conn,$visitor_id);
			$fetchChatHistory = "SELECT * FROM conversation_log WHERE user_id = '$visitor_id' ORDER BY unix_timestamp";
			mysqli_set_charset($this->conn, 'utf8');
			$fetchChatHistoryresult = mysqli_query($this->conn,$fetchChatHistory);
			$i=0;
			while($fetchChatHistoryrow = mysqli_fetch_assoc($fetchChatHistoryresult)){
				$result[$i]['ai_answer']       = $fetchChatHistoryrow['ai_answer'];			
				$result[$i]['ai_question']     = $fetchChatHistoryrow['ai_question'];
				$result[$i]['timestamp']       = $fetchChatHistoryrow['timestamp'];			
				$result[$i]['unix_timestamp']  = $fetchChatHistoryrow['unix_timestamp'];
				$result[$i]['user_id']         = $fetchChatHistoryrow['user_id'];

				$i++;		
			}

			return $result;
	}

}

$response = new utils('root','root','chatbot','localhost');

$call_type         = $_REQUEST['call_type'];

if ($call_type == 'saveChatHistory') {
	$api_question      = $_REQUEST['api_question'];
	$api_answer        = $_REQUEST['api_answer'];
	$visitor_id        = $_REQUEST['visitor_id'];
	$request_response  = $response->saveChat($api_question,$api_answer,$visitor_id);
	echo $request_response;
}

if ($call_type == 'setChatHistory') {
	$visitor_id        = $_REQUEST['visitor_id'];
	$request_response  = $response->getChatHistory($visitor_id);
	// print_r($request_response);

	if (count($request_response)>0) {
		echo json_encode($request_response);
	}

	if (count($request_response)<1) {
		echo "no results";
	}

}
