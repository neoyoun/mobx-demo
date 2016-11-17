<?php
header("Content-type: text/html;charset=utf-8");
require "conn.php";

$sql = "create TABLE {$targetSheet} (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
mobile CHAR(20) NOT NULL COMMENT '手机号码',
content VARCHAR(500) NOT NULL,
type TINYINT(3) NOT NULL,
addtime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL 
)";
if( $conn->query($sql) === TRUE ){
	echo "成功创建数据表".$targetSheet;
} else {
	echo "创建表失败".mysqli_error($conn);
}

$typeNameSql = "create TABLE messagetype (
id INT(2) UNSIGNED  PRIMARY KEY,
typename CHAR(20) NOT NULL
)";
if( $conn->query($typeNameSql) === TRUE ){
	echo "成功创建数据表".$messagetype;
} else {
	echo "创建表失败".mysqli_error($conn);
}
mysqli_close($conn);
/*if( $conn->query($sql) === TRUE ){
	echo "成功创建数据表";
} else {
	echo "创建数据表失败".$conn->error;
}*/
?>