console.log("	APP/ROUTES.JS")

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: '1wyvc2xuxPErXRptWapu8w',
  consumer_secret: 'HNHgD6M5zIIDLGzcX6SwN-8lCr0',
  token: '5AznV1uRsk9Wx3YLMKFGcmbjx8Z8VpgW',
  token_secret: 'sqCqxJcvf3wNemlOnx7HoYkWPxc',
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
		})
		.catch(function (err) {
		});
	});
	
};