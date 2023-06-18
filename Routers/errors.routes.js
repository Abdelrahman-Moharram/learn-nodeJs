const router = require('express').Router();
const {NotFound404} = require('../Controllers/errors')

router.use(NotFound404)

module.exports = router