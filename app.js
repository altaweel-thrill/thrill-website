const express = require('express');
const ejs = require('ejs');
const path = require('path')

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname , '/public')));
// app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log('server started');
});


app.get('/',function(req,res){
res.render("index");

});

app.get('/service',function(req,res){
    res.render("service");
    
})

app.get('/about',function(req,res){
        res.render("about");
        
})


app.get('/contact',function(req,res){
            res.render("contact");
            
})

app.get('*',function(req,res){
    res.render("404");
    
})