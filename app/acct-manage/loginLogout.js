console.log("	APP/ACCT-MANAGE/LOGINLOGOUT.JS")

// app/acct-manage/loginLogout.js
module.exports = function(app, passport) {
	
    // =====================================
    // LOGIN ===============================
    // =====================================

	app.get('/loginfailure', function(req, res){
		res.send(JSON.stringify({message: req.flash('loginMessage')}));
	});
	
    app.post('/login', passport.authenticate('local-login', {failureRedirect: '/loginfailure', failureFlash : true}), function(req, res) {
		var user = req.user;
		if (user){
			var userInfo = {id:user._id,username:user.local.username,email:user.local.email,avatar:user.local.avatarURL,bars:user.bars};
			res.send(JSON.stringify(userInfo));
		}
	});
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('acct-manage/signup.ejs', { user : req.user, message: req.flash('signupMessage'), packagedUser : JSON.stringify(req.user) // for angular to know });
    	});
	});
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to home page with logged in status
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================//DROPPED/ USE FOR OPTIONS
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('acct-manage/profile.ejs', {
            user : req.user, // get the user out of session and pass to template
			packagedUser : JSON.stringify(req.user) // for angular to know
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}