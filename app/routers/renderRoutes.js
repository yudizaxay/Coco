const router = require('express').Router();
const userRender = require('./user_render');

router.use('/', userRender);

module.exports = router;