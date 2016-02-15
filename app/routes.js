console.log("	APP/ROUTES.JS")

var Bar = require('./models/bar');
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
            user : req.user, // get the user out of session and pass to template
			packagedUser : JSON.stringify(req.user) // for angular to know
        }); // load the index.ejs file
    });
	
    // =====================================
    //  SEARCH FOR BARS ========
    // =====================================
	app.post("/search", function(req, res) {
		yelp.search({ term: 'bars', location: req.body.where })
		.then(function (data) {
			res.send(JSON.stringify(data));
		})
		.catch(function (err) {
			throw err;
		});
	});
	
    // =====================================
    //  ADD USER TO BAR========
    // =====================================
	app.post("/addbar", function(req, res) {
		Bar.findOne({id:req.body.bar_id}, function(err, bar){
			if(!bar){
				//create a new bar if no bar yet
				    var newBar            = new Bar();
					newBar.id = req.body.bar_id;
				// and then add the user to that bar
					newBar.users.push(req.body.user.id);
				//save
				    newBar.save(function(err) {
                        if (err)
                            throw err;
						console.log("saved new bar");
                    });
			}
			else{
				//add the user to that bar
				bar.users.push(req.body.user.id);
				//save
				    bar.save(function(err) {
                        if (err)
                            throw err;
						console.log("updated bar");
                    });
			}
			if(!err)
				res.send(200);
			else{
				res.send(500);
			}
		})
	});
	
};