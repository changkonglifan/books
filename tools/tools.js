var http = require("http");
var fs = require("fs");

var Regular = {
	urls:/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g,
	authorName :/<span\sitemprop=\"name\">\s{1,}[\u4e00-\u9fa5]{1,}<\/span>/,
	words:/[\u4e00-\u9fa5]{1,}/,
	time:/<span\sitemprop=\"dateModified\">[0-9]{4}[\-][0-9]{2}[\-][0-9]{2}[\s][0-9]{2}[\:][0-9]{2}<\/span>/,
	time1:/[0-9]{4}[\-][0-9]{2}[\-][0-9]{2}[\s][0-9]{2}[\:][0-9]{2}/,
	bookName:/<h1\sitemprop=\"name\">\s{1,}[\u4e00-\u9fa5]{1,}<\/h1>/,
	bookType:
}
exports.Regular = Regular;

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

