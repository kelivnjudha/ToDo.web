const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const clientRouter = require('./routes/main');

const adminRouter = require('./routes/admin');

const controller = require('./controllers/main_(dev)');
const app = express();

app.use(session({
    secret: 'bd492fc1d46e82bcc88a73939c72e683fc0a293f121a24c241b4661b65c215a3',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // USE True in production
}))

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

app.use('/admin', adminRouter);
app.use(clientRouter);

app.listen(3000);