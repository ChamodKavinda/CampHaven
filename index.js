const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.send('HELLO FROM CAMP HAVEN');
})

app.listen(8080,(req,res)=>{
    console.log('server running');
})