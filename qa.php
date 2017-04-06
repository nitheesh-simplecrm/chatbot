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

// 	public function getAnswer($question){
// 			$fetchAnswer = "select answer from questions_answers where question like '%$question%'";
// 			$fetchAnswerresult = mysqli_query($this->conn,$fetchAnswer);
// 			$fetchAnswerrow = mysqli_fetch_assoc($fetchAnswerresult);
// 			$answer = $fetchAnswerrow['answer'];
// 			if(empty($answer)){
// 				$answer = 'OK, please try to rephrase your query in some other way';
// 			}
// 			return $answer;
// 	}

// }

	public function getAnswer($question){
			$fetchAnswer = "select question,answer from questions_answers";
			mysqli_set_charset($this->conn, 'utf8');
			$fetchAnswerresult = mysqli_query($this->conn,$fetchAnswer);
			$i=0;
			while($fetchAnswerrow = mysqli_fetch_assoc($fetchAnswerresult)){
				similar_text($question,$fetchAnswerrow['question'],$percent);
				$result[$i]['answer'] = $fetchAnswerrow['answer'];			
				$result[$i]['percent'] = $percent;	
				$i++;		
			}
			return $result;
	}

}

function percentDescSort($item1,$item2)
{
    if ($item1['percent'] == $item2['percent']) return 0;
    return ($item1['percent'] < $item2['percent']) ? 1 : -1;
}


$response = new utils('root','root','chatbot','localhost');
$question = $_REQUEST['input'];
$questions = $response->getAnswer($question);
usort($questions,'percentDescSort');
$answer = $questions[0]['answer'];
$percent = $questions[0]['percent'];
if($percent >= 50){
	echo $answer;
}else{
	echo 'OK, please try to rephrase your query in some other way';
}
