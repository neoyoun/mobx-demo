<?php
ini_set("max_execution_time", "0");
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : '';
$allow_origin = array(  
  'http://aljbbs.com',  
  'http://pjsw.cn',
  'http://localhost:3000'
);
if(in_array($origin, $allow_origin)){  
    header('Access-Control-Allow-Origin:'.$origin);       
}
require "conn.php";
class Data {
	var $length;
	var $leastId;
	var $messages;

	function len ($par) {
		if( isset($par) ){
			$this->length = $par;
		} else {
			echo $this->length;
		}
		
	}
	function id ($par) {
		if( isset($par) ){
			$this->leastId = $par;
		} else {
			echo $this->lastid;
		}
	}
	function messages ($par) {
		if( isset($par) ){
			$this->messages = $par;
		} else {
			echo json_encode($this->messages) ;
		}
	}
}
if ($_SERVER["REQUEST_METHOD"] == "GET") {
	if( !empty($_GET["leastId"]) ){
		//监听数据更新 
		$leastId = $_GET["leastId"];
		listeningNewData($conn,$targetSheet,$leastId);
	}else if( empty($_GET["startIndex"])) {
		//首次进入页面载入数据
		loadData($conn,$targetSheet,$_GET["amount"],null);
	}else {
		//查询旧数据
		$amount = $_GET["amount"];
		loadData($conn,$targetSheet,$_GET["amount"],$_GET["startIndex"]);
	}
} else {
	echo 'error...';
	exit;
}

/*
 *load messages from database;
 * 页面载入时首次下载数据
 * 
 */
function loadData($conn,$targetSheet,$amount,$startIndex){
	if( strlen($amount) == 0 ){
		$amount = 10;
	}
	if( isset($startIndex) ){
		$selectSql = "select M.*,N.typename FROM {$targetSheet} AS M,messagetype AS N WHERE N.id=M.type AND M.id<{$startIndex} ORDER by M.id desc limit 0,{$amount}";
	} else {
		$selectSql = "select M.*,N.typename FROM {$targetSheet} AS M,messagetype AS N WHERE N.id=M.type ORDER by M.id desc limit 0,{$amount}";
	}
$data = new Data();
	if( $result = $conn->query($selectSql) ) {
			if( $result->num_rows > 0 ){
				$length = $result->num_rows;
				$resultArr = [];
				while ( $obj = mysqli_fetch_object($result) )
				{
					$obj->content = htmlspecialchars_decode($obj->content);
					array_push($resultArr, $obj);
				}
				mysqli_free_result($result);
				$leastId = intval($resultArr[0]->id);
				$resultArr = array_reverse($resultArr,false);
				if( !empty($_COOKIE["usermobile"])){
					$data->userMobile = $_COOKIE["usermobile"];
				}
				$data->leastId= $leastId;
				$data->length= $length;
				$data->messages= $resultArr;
			}else {
				$data->length= 0;
			}
			echo json_encode($data);
		} else {
			echo "400";
		}
}
// push 数据
function listeningNewData($conn,$targetSheet,$leastId) {
	while ($leastId) {
		$sql = "select M.*,N.typename FROM {$targetSheet} AS M,messagetype AS N WHERE N.id=M.type and M.id>{$leastId} order by id desc";
		$data = new Data();
		if( $result = $conn->query($sql) ){
			if( $result->num_rows > 0 ){
					$length = $result->num_rows;
					$resultArr = [];
					while ( $obj = mysqli_fetch_object($result) )
					{
						$obj->content = htmlspecialchars_decode($obj->content);
						array_push($resultArr, $obj);
					}
					mysqli_free_result($result);
					$leastId = intval($resultArr[0]->id);
					$resultArr = array_reverse($resultArr,false);
					if( !empty($_COOKIE["usermobile"])){
						$data->userMobile = $_COOKIE["usermobile"];
					}
					$data->leastId= $leastId;
					$data->length= $length;
					$data->messages= $resultArr;
					echo json_encode($data);
				}
				
			} else {
				exit;
			}
		ob_flush();
		flush();
		sleep(1);
	}
}
//mysqli_close($conn);
?>