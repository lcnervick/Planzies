const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const errorhandler = require('errorhandler');
const jwt = require('jsonwebtoken');
const notifier = require('node-notifier');
const session = require('express-session');


const login = require('./login');

const app = express();
const PORT = process.env.PORT || 80;

const errorNotification = (err, str, req) => {
	notifier.notify({
		title: 'Error in ' + req.method + ' ' + req.url,
		message: str
	});
};

app.use(cors());
app.use(bodyParser.json());
app.use(errorhandler({ log: errorNotification }))
app.use(
	session({
		secret: crypto.randomUUID(),
		cookie: { maxAge: 1000 * 60 *60 * 24, secure: true, sameSite: "strict" },
		resave: false,
		saveUninitialized: false,
	})
);

app.use(login({app}));



app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	console.log(`Serving static files from: ${__dirname+'/public'}`);
	app.use(express.static(__dirname+'/public'));
});

module.exports = app;

