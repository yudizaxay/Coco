const router = require('express').Router();
const controllers = require('./lib/controllers');

router.get('/', controllers.landing);
router.get('/events',controllers.allEvents);
router.get('/nfts',controllers.nfts);

module.exports = router;