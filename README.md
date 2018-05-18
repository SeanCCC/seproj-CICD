# CICD
## 介紹
* CICD是一套從版控到單元測試到部屬的自動化流程。
### 組成
* 版本控制 + CI + CD
### 版本控制
* 透過github, gitlab, bitbucket...
* 把完成的feature給merge到dev上面
* ![](https://i.imgur.com/OJdCPxK.png)
### CI(Continuous Integration)
* 自動化檢查
* 會自動檢查有變更的指定branch，每次有變更都會跑一次unit test
* 透過travis CI, gitlab CI...
* 會在code被merge到master時進行lint與自動化測試
### CD(Continuous Deployment)
* 自動化部屬
* 每次有變更時，會等待unit test通過，然後執行指定的指令來deploy服務
* 透過Heroku等等...
## 實作
### Step1 建立要deploy的服務
* 採用Node JS和express框架
* 用restful API的形式提供服務
* 功能為把傳入的數字加一在回傳
```javascript=
// index.js
var express = require('express');
var add = require('./lib/add');
var app = express();
var port = process.env.PORT || 8080;

app.get('/test', function (req, res) {
    var data = {
        "msg": "hello world! 2332", 
        "result": add(Number(req.query.input))
    }
    console.log( data );
    res.end( JSON.stringify(data) );
})

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("應用實例，訪問地址為 http://%s:%s", host, port)
})
```
```javascript=
// lib/add.js
module.exports = function add(num) {
    return num+2
}
```

### Step2 將程式碼上傳到Github上
* 建立repo後把程式碼push上去

### Step3 設定TravisCI
* 將Repo連結到TravisCI
* 把測試用的程式碼給放上去
```javascript=
const should = require('should')
const add = require('../lib/add')

describe('#add', () => {
    it('should return the num+1', done => {
      var result = add(-10)
      result.should.equal(-8)
      done()
    })
    it('should return NaN when the number is not natural', done => {
      var result = add(10)
      result.should.equal(12)
      done()
    })
  })
```
* 把travis設定給push上去
```yml=
# .travis.yml
language: node_js
node_js:
  - 8.11.2
script:
  - "npm run test" # 即執行mocha
```
* ![](https://i.imgur.com/kcnT6Ty.png)
* 以後push完就會自動進行測試了
	* ![](https://i.imgur.com/d9A5Tlv.png)
	* ![](https://i.imgur.com/X1I6yYj.png)
* 如果測試失敗會像這樣，並阻止接下來的CD階段
	* ![](https://i.imgur.com/BJjCc8F.png)
	* ![](https://i.imgur.com/zF3BBUz.png)
* 會收到Email提醒，在Github也看的到
	* ![](https://i.imgur.com/Df7PcPT.png)
	* ![](https://i.imgur.com/jnpeXR1.png)

### Step4 連結Heroku
* 將Github repo連結起來
* 勾選Wait fo CI to pass before deploy
* 並啟動自動deploy
* ![](https://i.imgur.com/B3CXI3L.png)
* 如果是用node，可以把npm start設為開始服務的指令
* 勾選下圖後就會從npm start開始執行
	* ![](https://i.imgur.com/xiERf8J.png)
* 此後如果master branch的程式碼被更新了，就會自動先由travisCI先跑unit test，如果通過再由Heroku自動deploy

### Step5 Monitor
* 可以用log來監控service執行
* ![](https://i.imgur.com/qnRZhSU.png)
* 例如下方便有報錯，讓我快速知道是env.port沒有寫好
```
-----> Node.js app detected
-----> Build failed
 !     Two different lockfiles found: package-lock.json and yarn.lock
       Both npm and yarn have created lockfiles for this application,
       but only one can be used to install dependencies. Installing
       dependencies using the wrong package manager can result in missing
       packages or subtle bugs in production.
       - To use npm to install your application's dependencies please delete
         the yarn.lock file.
         $ git rm yarn.lock
       - To use yarn to install your application's dependences please delete
         the package-lock.json file.
         $ git rm package-lock.json
    
       https://kb.heroku.com/why-is-my-node-js-build-failing-because-of-conflicting-lock-files
 !     Push rejected, failed to compile Node.js app.
 !     Push failed
```
![](https://i.imgur.com/zgRArKo.png)

