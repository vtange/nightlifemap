console.log("	APP/ROUTES.JS")

var Yelp = require('yelp');
// load the auth variables
var configAuth = require('../config/auth'); // use this one for testing

var yelp = new Yelp({
  consumer_key: configAuth.yelpAuth.consumer_key,
  consumer_secret: configAuth.yelpAuth.consumer_secret,
  token: configAuth.yelpAuth.token,
  token_secret: configAuth.yelpAuth.token_secret,
});

// app/routes.js
module.exports = function(app) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            user : req.user // get the user out of session and pass to template
        }); // load the index.ejs file
    });
	
	app.post("/", function(req, res) {
		yelp.search({ term: 'bars', location: req.body.where })
		.then(function (data) {
			res.send(JSON.stringify(data));
		})
		.catch(function (err) {
			throw err;
		});
	});
	
};