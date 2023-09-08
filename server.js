const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const notifier = require('node-notifier');
const errorhandler = require('errorhandler');

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



app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	console.log(`Serving static files from: ${__dirname+'/public'}`);
	app.use(express.static(__dirname+'/public'));
});

module.exports = app;

