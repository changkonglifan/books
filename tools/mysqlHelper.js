var mysql = require("mysql");

var options = {
	host: 'localhost',
	port:3306,
	database:'books',
	user:"root",
	password:""
}
/**
 * 创建数据库连
 * 接池
 * @type {[type]}
 */
var pool = mysql.createPool(options);
exports.query =function(sql,fn){
	pool.getConnection(function(err,connection){
		if(err){console.log("建立链接失败" + err.message);return;}
		console.log("链接成功");
		connection.query(sql,function(err,result){
			if(err){
				console.log("数据库操作失败");
			}
			else{
				fn(result);
			}
		})
		connection.end();
	})
}
