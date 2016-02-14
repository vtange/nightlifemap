// app/models/bar.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var barSchema = mongoose.Schema({

    id            : String,
	users		  : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// methods ======================
// n/a

// create the model for users and expose it to our app
module.exports = mongoose.model('Bar', barSchema);
