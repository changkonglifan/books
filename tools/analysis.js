var tools = require("./tools.js")
var fs = require("fs");

var sqlHelper = require("./mysqlHelper.js");

var Analysis = function(){

	this.urlOld = [];//已经遍历的元素
}

/**
 * 替换全部
 * @param  {[type]} achar [description]
 * @param  {[type]} charA [description]
 * @param  {[type]} charB [description]
 * @return {[type]}       [description]
 */
var replaceAll = function(achar,charA,charB){
     var rep = new RegExp(charA,"g");
     return achar.replace(rep,charB);
}

/**
 * 得到请求数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Analysis.prototype.init = function(data) {
	//获取所有的urls地址
	var urls = this.getUrls(data);
	//获取有效的url地址
	var iUrls = this.getEffectiveUrls(urls);
	//保存书本详细地址
	// Array.prototype.push.apply(this.urlList,iUrls);//详细地址库

	fs.appendFile("./urlList.txt",iUrls,function(err){
		if(err){console.log("地址 写入失败" + err.message)}
		else{
			console.log("地址 写入成功" )
		}
	})
};
/**
 * 匹配url
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Analysis.prototype.getUrls = function(data){
	var reg = tools.Regular.urls;
	var hrefs = data.match(reg);//所有的urls
	return hrefs;
}
/**
 * 获取有效地址
 * @param  {[type]} urls [description]
 * @return {[type]}      [description]
 */
Analysis.prototype.getEffectiveUrls = function(urls){
	var rUrls = [];
	for(var i = 0; i < urls.length; i++){
		var tempUrl = urls[i];
		if(tempUrl.indexOf("www.qidian.com/Book") >= 0 && rUrls.indexOf(tempUrl) < 0){
			rUrls.push(tempUrl);
		}
	}
	return rUrls;
}
/**
 * 解析详细数据 
 * 阅读页
 * 两件事：1，获取 书 图片
 * 2，获取书阅读地址
 */
Analysis.prototype.anaDetail = function (data,path){
	var that = this;
	var bookId = path.split("/")[2].split(".")[0];//书ID
	var imgUrl = "";//图片路径
	var author = data.match(tools.Regular.authorName)[0].match(tools.Regular.words)[0].trim();//作者
	var time = data.match(tools.Regular.time)[0].match(tools.Regular.time1)[0];
	var bookName = data.match(tools.Regular.bookName)[0].match(tools.Regular.words)[0].trim();//书名
	var bookType = data.match(tools.Regular.bookName)[0].match(tools.Regular.bookName1)[0].trim();//书名
	console.log(author);
	return;
	anaReadUrl(data);
	function anaReadUrl(data){
		var urls = that.getUrls(data);
		var readUrl = "";
		var imgUrl = "";
		for(var i = 0 ; i  < urls.length ; i++){
			if(urls[i].indexOf("read.qidian.com")>=0){
				readUrl = urls[i];
			}
			if(urls[i].indexOf("qpic")>=0){
				imgUrl = urls[i];
			}
		}
		saveUrl = "/public/bookImages/"+bookId;
		tools.saveImage(imgUrl,saveUrl,bookId);//保存图片
		//写入数据库
		// that.insertBook(bookId,saveUrl);
	}
}
/**
 * 插入数据库
 * @return {[type]} [description]
 */
Analysis.prototype.insertBook = function(bookId,saveUrl){
	var sql = "insert into b_list set bookId = " + bookId +",imgSrc = '" + saveUrl+"'";
	sqlHelper.query(sql,callBack);
	function callBack(result){
		if(result.affectedRows == 1){
			console.log('插入成功！')
		}
	}

}

/**
 * 获取标题
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Analysis.prototype.getTitle = function(data){

}

exports.Analysis = new Analysis();