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

	public function getAnswer($question){
			$fetchAnswer = "select answer from questions_answers where question like '%$question%'";
			$fetchAnswerresult = mysqli_query($this->conn,$fetchAnswer);
			$fetchAnswerrow = mysqli_fetch_assoc($fetchAnswerresult);
			$answer = $fetchAnswerrow['answer'];
			if(empty($answer)){
				$answer = 'OK, please try to rephrase your query in some other way';
			}
			return $answer;
	}

}

$response = new utils('root','root','chatbot','localhost');
$question = $_REQUEST['input'];
echo $response->getAnswer($question);