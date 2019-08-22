const Express = require('express');
var app =new Express();
app.set('view engine','ejs');

app.use(Express.static(__dirname+"/public"));

app.get('/',(req,res)=>{
  res.render('index')
});

app.get('/registration',(req,res)=>{
    res.render('registration')
});


app.listen(4000,()=>{
    console.log('server running on 4000')

});