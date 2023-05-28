const express = require('express');
const router = express.Router();
const {problem} = require("../Controllers/AboutController")


router.get("/", problem)

module.exports = router