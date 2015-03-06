//socketやデータベースのアクセスに
var url　= location.href;
urls = url.split("/?");
var domain = urls[0];
console.log("domain is"+domain);

//グローバルソケット
var socket = io.connect(domain);