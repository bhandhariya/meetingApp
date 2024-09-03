const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['employee', 'manager','admin'], default: 'employee' }
});

module.exports = mongoose.model('User', userSchema);


/// this will be static part



//  outlook event will crete   when creating meeting 