const router = require('express').Router();
const {is_authenticated} = require('./guard/auth.guard')
const {index, chat, profile, FriendRequest, getfriendsRequests,removeRequest, acceptRequest, search, markRead} = require("../Controllers/home")

router.get("/get-notifications",is_authenticated, markRead)

router.get('/', index)
router.get("/friends-requests" ,is_authenticated,getfriendsRequests)
router.get("/:username",profile)
router.get("/:username/add-friend" ,is_authenticated,FriendRequest) // not implemented yet .
router.get('/chat/:username', is_authenticated, chat)
router.get('/remove-request/:id', is_authenticated, removeRequest)
router.get('/accept-request/:id', is_authenticated, acceptRequest)
router.get('/search/', search)


module.exports = router