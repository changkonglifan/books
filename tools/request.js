//请求链接
var http = require("http");

var analysis = require("./analysis.js");

var fs = require("fs");
function requestClass(){
	this.http = http;
	this.fs =fs;
	this.options =  {
		hostname : "a.qidian.com",
		prot : 80,
		path : "/",
		method: "GET"
	};
	this.nextPage = 1;//翻页
	this.hadEnd = false;
}
/**
 * 获取下一页地址
 * @param  {[type]} urls [description]
 * @return {[type]}      [description]
 */
requestClass.prototype.getNextPages = function(urls){
	return "/?size=-1&sign=-1&tag=-1&chanId=-1&subCateId=-1&orderId=&page=" + ( ++this.nextPage ) + "&month=-1&style=1&action=-1&vip=-1";
} 
requestClass.prototype.getRequest = function(fn){
	var that = this;
	var htmlData = "";
	var req = http.request(this.options,function(res){
		res.setEncoding("utf8");//设置编码
		res.on('data', function(data) {
			htmlData += data;
			/* Act on the event */
		}).on('end', function(event) {
			if(htmlData.indexOf("没有找到符合条件的书") >=0){
				that.hasEnd = true;
				that.getDetailData();
				return;
			}
			analysis.Analysis.init(htmlData);
		 	that.getNextRequest();
			/* Act on the event */
		});;
	});
	req.on('error', function(e) { 
		console.log('problem with request: ' + e.message); 
	}); 
	//结束请求
	req.end();
}
/**
 * 获取下一个页面的地址
 * @return {[type]} [description]
 */
requestClass.prototype.getNextRequest =function(){
	var nextUrl = this.getNextPages();
	this.options.path = nextUrl;
	this.getRequest();
}
function subRequest (url){
	requestClass.call(this)
}
/**
 * 读取文件地址
 * @return {[type]} [description]
 */
requestClass.prototype.getDetailList =function(){
	var that = this;
	fs.readFile("./urlList.txt",'utf8',function(err,data){
		if(err){console.log("读取urlList出错")}
		else{
			var urlList = data.split(",");
			that.getDetailData(urlList);
		}
	})
}
/**
 * 获取详细地址
 * @return {[type]} [description]
 */
requestClass.prototype.getDetailData = function(urlList){
	// while(urlList){
		if(urlList.length == 0){return;}
		var detailUrl = urlList.splice(0,1)[0];//拿到第一个地址，并从待查询列表中删除
		analysis.Analysis.urlOld.push(detailUrl);
		var hostname = detailUrl.split("://")[1].split("/")[0];
		var path = detailUrl.substr(detailUrl.indexOf(hostname) + hostname.length,detailUrl.length);
		var option = {
			hostname: hostname,
			prot : 80,
			path : path,
			method: "GET"
		}
		this.getDetailRequest(option);
	// }	
}
/**
 * 获取详情页面
 * @param  {[type]} option [description]
 * @return {[type]}        [description]
 */
requestClass.prototype.getDetailRequest = function(option){
	var htmlData = "";
	var that = this;
	var req = http.request(option,function(res){
		res.setEncoding("utf8");//设置编码
		res.on('data', function(data) {
			htmlData += data;
			/* Act on the event */
		}).on('end', function(event) {
			analysis.Analysis.anaDetail(htmlData,option.path,that.getReadRequest,that);
		 	// that.getNextRequest();
			/* Act on the event */
		});;
	})
	req.on('error', function(e) { 
		console.log('problem with request: ' + e.message); 
	}); 
	//结束请求
	req.end();
}
/**
 * 获取文章阅读列表
 * @param  {[type]} url [description]
 * @return {[type]}     [description]

 */
requestClass.prototype.getReadRequest = function(url){
	// console.log(url);
	// console.log(this.http);
	var that = this;
	var obj = anaUrl(url);
	var option = {
		hostname : obj.hostname,
		prot : 80,
		path : obj.path,
		method: "GET"
	}
	var htmlData = "";
	var req = this.http.request(option,function(res){
		res.setEncoding("utf8");//设置编码
		res.on('data', function(data) {
			htmlData += data;
			/* Act on the event */
		}).on('end', function(event) {
			analysis.Analysis.anaChapterUrl(htmlData);
		 	// that.getNextRequest();
			/* Act on the event */
		});;
	})
	req.on('error', function(e) { 
		console.log('problem with request: ' + e.message); 
	}); 
	//结束请求
	req.end();
}
/**
 * 获取请求
 * @param  {[type]}   url 请求地址[description]
 * @param  {Function} fn 回调函数  [description]
 * @param  {[type]}   obj 回调对象[description]
 * @return {[type]}       [description]
 */
requestClass.prototype.getRequest =function(url,fn,obj){

}

function anaUrl ( url){
	var arr = url.split(".com");
	var hostname = arr[0].split("://")[1]+".com";
	var path = arr[1];
	return {
		hostname:hostname,
		path:path
	}
}
subRequest.prototype = Object.create(requestClass.prototype);

//返回对象
exports.request = new subRequest(); 