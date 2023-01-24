const passport = require('passport');

exports.module = passport.authenticate('jwt', {session:false})