const router = require('express').Router();

const authRoute = require('./user');

router.use('/user', authRoute);

module.exports = router;
