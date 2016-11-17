<?php
header("Content-type: text/html; charset=utf-8");
require "conn.php";
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : '';
$allow_origin = array(  
  'http://aljbbs.com',  
  'http://pjsw.cn',
  'http://localhost:3000'
);
if(in_array($origin, $allow_origin)){  
	echo $origin;
    header('Access-Control-Allow-Origin:'.$origin); 
   // header('Access-Control-Allow-Credentials:true');      
}else{
	$servername=$_SERVER['SERVER_NAME'];
	$server_len = strlen($servername);
	$client = $_SERVER['HTTP_REFERER'];
	if( preg_match('/^http:\/\//', $client) ){
		$protocal_len = 7;
	}else if(preg_match('/^https:\/\//', $client)){
		$protocal_len = 8;
	}
	if(substr($client,$protocal_len,$server_len) != $servername){
		echo "消息来源有误，服务器已拒绝请求";
		exit;
	}
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$newmessage = ($GLOBALS['HTTP_RAW_POST_DATA']);
	if( !is_string($newmessage)){
		header('HTTP/1.0 502 FORBIDDEN');
		print_r($newmessage);
		die();
	}
	$newmessage = json_decode($newmessage);
	$cookieMobile = $_COOKIE["usermobile"];
	if ( strlen($cookieMobile) > 0 && $newmessage->mobile != $cookieMobile){
		setcookie('usermobile','',-1);
	}
	$expire = time()+60*60*24;
	setcookie('usermobile',$newmessage->mobile,$expire,'/');
	insertNewMessage($conn ,$targetSheet, $newmessage);
}else {
	echo 'error..';
}
function insertNewMessage($conn,$targetSheet,$newmessage){
	$mobile = $newmessage->mobile;
	$content = htmlspecialchars($newmessage->content,ENT_QUOTES);
	$type = $newmessage->type;
	$insertSql = "INSERT INTO {$targetSheet} SET mobile='{$mobile}',content='{$content}',type={$type}";
	if( $result = $conn->query($insertSql)) {
		$insertId = mysqli_insert_id($conn);
	} else {
		echo "插入数据失败。。。。。。".$newmessage;
	}
}
?>