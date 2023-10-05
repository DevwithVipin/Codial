const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const customMware = require('./config/middleware')



app.use(express.urlencoded({extended:true}));

app.use(cookieParser());


app.use(express.static('./assets'));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store : new MongoStore({
        mongoUrl: 'mongodb://localhost/codeial_development', // Your MongoDB connection URL
        autoRemove: 'native', // Optional: This might not be necessary, depending on your use case
      
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok')
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// use express router
app.use(passport.setAuthenticatedUser);
app.use(flash())
app.use(customMware.setFlash)
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
