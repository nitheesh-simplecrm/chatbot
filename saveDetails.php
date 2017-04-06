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

	public function saveDetails($name,$phone,$message,$ipaddress){
		$name = mysqli_real_escape_string($this->conn,$name);
		$phone = mysqli_real_escape_string($this->conn,$phone);
		$message = mysqli_real_escape_string($this->conn,$message);
		$ipaddress = $ipaddress;
		$storeQuery = "INSERT INTO usersinfo(name, phone,message, ipaddress) VALUES ('$name','$phone','$message','$ipaddress')";
		mysqli_set_charset($this->conn, 'utf8');
		mysqli_query($this->conn,$storeQuery);
		return $last_id = mysqli_insert_id($this->conn);
	}

	public function get_client_ip() {
	    $ipaddress = '';
	    if (isset($_SERVER['HTTP_CLIENT_IP']))
	        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
	    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
	        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
	    else if(isset($_SERVER['HTTP_X_FORWARDED']))
	        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
	    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
	        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
	    else if(isset($_SERVER['HTTP_FORWARDED']))
	        $ipaddress = $_SERVER['HTTP_FORWARDED'];
	    else if(isset($_SERVER['REMOTE_ADDR']))
	        $ipaddress = $_SERVER['REMOTE_ADDR'];
	    else
	        $ipaddress = 'UNKNOWN';
	    return $ipaddress;
	}

}

$createUser = new utils('root','root','chatbot','localhost');
$name = $_REQUEST['name'];
$phone = $_REQUEST['mobile'];
$message = $_REQUEST['message'];
$ipaddress = $createUser->get_client_ip();
$last_id = $createUser->saveDetails($name,$phone,$message,$ipaddress);
echo json_encode(array('userID'=>$last_id,'name'=>$name));
