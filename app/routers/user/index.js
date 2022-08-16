const router = require('express').Router();
const controllers = require('./lib/controllers');

router.post('/create', controllers.registerEvent); 
router.get('/fetch', controllers.fetchNFTS); 
router.get('/token/:sHash', controllers.fetchToken); 
router.get('/updateToken/:sHash/token/:nToken', controllers.updateToken);

module.exports = router;
