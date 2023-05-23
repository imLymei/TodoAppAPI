var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
 username: {
 unique: true,
 type: String
 },
 hash: String,
 salt: String
},
 {
 versionKey: false
 }
);
module.exports = mongoose.model('User', userSchema)