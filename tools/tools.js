var http = require("http");
var fs = require("fs");

var Regular = {
	urls:/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g,
	authorName :/<span\sitemprop=\"name\">\s{1,}[\u4e00-\u9fa5]{1,}<\/span>/,
	words:/[\u4e00-\u9fa5]{1,}/,
	txt : /\d{1,}/,
	time:/<span\sitemprop=\"dateModified\">[0-9]{4}[\-][0-9]{2}[\-][0-9]{2}[\s][0-9]{2}[\:][0-9]{2}<\/span>/,
	time1:/[0-9]{4}[\-][0-9]{2}[\-][0-9]{2}[\s][0-9]{2}[\:][0-9]{2}/,
	bookName:/<h1\sitemprop=\"name\">\s{1,}[\u4e00-\u9fa5]{1,}<\/h1>/,
	bookType: /<span\sitemprop=\"genre\">{1,}[\u4e00-\u9fa5]{1,}<\/span>/,
	bookTxtNum : /<span\sitemprop=\"wordCount\">\d{1,}<\/span>/,
	bookStauts : /<span\sitemprop=\"updataStatus\">[\u4e00-\u9fa5]{1,}<\/span>/,
	chapterUrl : /itemprop=\'url\'\shref=\"http:\/\/read.qidian.com\/BookReader\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g,
	readUrl :/<a\sitemprop=\"url\"\sstat-type=\"read\"\shref=\"(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/,
	imgUrl : /itemprop="image"\ssrc=\"(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/,
	chapterDataUrl : /<script\ssrc=\'(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]\'/,
	chapterName : /<h1>([\u4e00-\u9fa5_a-zA-Z0-9\s，……。？！]){1,}<\/h1>/,
	chapterNums : /<span>字数：[0-9]*/,
	chapterUpTime : /<span>更新时间\s:\s\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/g
}
exports.Regular = Regular;
/**
 * 创建文件夹
 * @param  {[type]} saveUrl [description]
 * @return {[type]}         [description]
 */
var mkdirs = function(saveUrl){
	var dirs = saveUrl.split("/");
	var dirPath = ".";
	for(var i =  0;i < dirs.length ; i++){
		if(dirs[i] == ""){continue;}
		dirPath += "/" + dirs[i];
		if(!!!fs.existsSync(dirPath)){
			fs.mkdirSync(dirPath,function(err){
				if(err){
	                console.log("mkdir fail");
	            }else{
	            	console.log("mkdir success");
	            }
			})
		}
	}
}
exports.mkdirs = mkdirs;

/**
 * 保存图片
 * @param  {[type]} imgUrl  [description]
 * @param  {[type]} saveUrl [description]
 * @param  {[type]} name    [description]
 * @return {[type]}         [description]
 */
exports.saveImage = function(imgUrl,saveUrl,name){

	http.get(imgUrl, function(res){
	    var imgData = "";

	    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

	    res.on("data", function(chunk){
	        imgData+=chunk;
	    });

	    res.on("end", function(){
    		mkdirs(saveUrl);
         	fs.writeFile("./" + saveUrl + "/"+  name+".jpg", imgData, "binary", function(err){
	            if(err){
	                console.log("down fail");
	            }else{
	            	console.log("down success");
	            }
	        });
	    });
	});
}

