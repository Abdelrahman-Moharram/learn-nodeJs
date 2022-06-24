var express = require('express');
var router = express.Router();
const HomeController = require('../Controller/HomeController')
/* GET home page. */
router.get('/',HomeController.index);
router.get('/search',HomeController.search);

module.exports = router;
