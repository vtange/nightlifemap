console.log("	APP/ROUTES.JS")

var User = require('./models/user');
var Bar = require('./models/bar');
var Yelp = require('yelp');
// load the auth variables
var configAuth = require('../config/auth'); // use this one for testing

var yelp = new Yelp({
  consumer_key: configAuth.yelpAuth.consumer_key,
  consumer_secret: configAuth.yelpAuth.consumer_secret,
  token: configAuth.yelpAuth.token,
  token_secret: configAuth.yelpAuth.token_secret
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
		User.findOne({_id:req.body.user.id},function(err, user){
			if (err){
				throw err;
			}
			Bar.findOne({id:req.body.bar_id}, function(err, bar){
				if(!bar){
					//create a new bar if no bar yet
						var newBar            = new Bar();
						newBar.id = req.body.bar_id;
					// and then add the user to that bar
						newBar.users.push(req.body.user.id);
						user.bars.push(newBar);
					
					//save
						user.save(function(err) {
							if (err)
								throw err;
							console.log("user has new bar");
						});					
					//save
						newBar.save(function(err) {
							if (err)
								throw err;
							console.log("saved new bar");
						});
						res.send(JSON.stringify({_id:newBar._id,id:newBar.id}))
				}
				else{
					//add the user to that bar
					bar.users.push(req.body.user.id);
					user.bars.push(bar);
					
					//save
						user.save(function(err) {
							if (err)
								throw err;
							console.log("user has new bar");
						});	
					//save
						bar.save(function(err) {
							if (err)
								throw err;
							console.log("updated bar");
						});
					res.send(JSON.stringify({_id:bar._id,id:bar.id}));
				}
			})
		})
	});
	// =====================================
    //  REMOVE USER FROM BAR========
    // =====================================
	app.post("/rembar", function(req, res) {
		User.findOne({_id:req.body.user.id},function(err, user){
			if (err){
				throw err;
			}
			Bar.findOne({id:req.body.bar_id}, function(err, bar){
				function findBarinUser(bar, user){
					var index = -1;
					for (var i=0;i<user.bars.length;i++){
						//find a bar within user.bars that has the id of the bar we found in mongoDB
						if(bar.id === user.bars[i].id){
							return i;
						}
					}
					return index;
				}

					//remove the user to that bar
					bar.users.splice(bar.users.indexOf(user._id),1);
					user.bars.splice(findBarinUser(bar,user),1);

					//save
						user.save(function(err) {
							if (err)
								throw err;
							console.log("user has less 1 bar");
						});	
					//save
						bar.save(function(err) {
							if (err)
								throw err;
							console.log("updated bar");
						});
					res.send(JSON.stringify({_id:bar._id,id:bar.id}));
			})
		})
	});
	// =====================================
    //  FIND A BAR========
    // =====================================
	app.post("/findbar", function(req, res) {
			Bar.findOne({id:req.body.bar_id}, function(err, bar){
				if(bar){
					res.send(JSON.stringify(bar.users));
				}
				else{
						//create a new bar if no bar yet
						var newBar            = new Bar();
						newBar.id = req.body.bar_id;
						newBar.save(function(err) {
							if (err)
								throw err;
							res.send(JSON.stringify(newBar.users));
						});
				}
			})
	});
	
	
	
};