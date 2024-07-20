const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
mongoose.connect('mongodb://localhost:27017/camp-haven');
const ExpressError = require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds.js');
const reviews = require('./routes/reviews');
const session = require('express-session');

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error"));
db.once("open",()=>{
    console.log("Database Connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use('/campgrounds',campgroundRouter);
app.use('/campgrounds/:id/reviews', reviews)

app.get('/',(req,res)=>{
    res.render('home');
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(8080,(req,res)=>{
    console.log('server running');
})