const router = require('express').Router();
const {is_authenticated, is_not_authenticated} = require('./guard/auth.guard')
const {
    login, 
    register, 
    post_login, 
    post_register, 
    logout } = require('../Controllers/accounts')

// gets
router.get("/login",is_not_authenticated,login)
router.get("/register", is_not_authenticated,register)
router.get("/logout", is_authenticated,logout)


// posts
router.post("/login", is_not_authenticated,post_login)
router.post("/register", is_not_authenticated,post_register)

module.exports = router