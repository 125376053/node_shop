var express =require('express')
var app= express()
var path = require('path')
var bodyParse = require('body-parser')
var jwt = require('jsonwebtoken');
app.use(bodyParse())
app.use(express.static(path.join(__dirname,'dist')));
app.get('/', function(req, res, next) {
    res.sendFile(path.resolve('./dist/index.html'))
});
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    if(req.path =='/api/users/login'){
        next()
        return
    }
    var tokenid=req.headers.token
    if(tokenid && tokenid!='null'){
        jwt.verify(tokenid, 'jiamia', function(err,decoded) {
            if (err) {
                return res.json({
                    code:400,
                    msg: 'token不合法'
                });
            } else {
                next()
            }
        })
    }else{
        res.json({
            code:400,
            msg: 'token失效'
        });
    }
})
// 路由处理
var indexRouter = require('./routes/index');
app.use('/api/', indexRouter);
app.listen(3301)
