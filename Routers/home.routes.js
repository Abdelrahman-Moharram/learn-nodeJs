const router = require('express').Router();
const {is_authenticated} = require('./guard/auth.guard')
const {index, chat, profile, FriendRequest, getfriendsRequests,removeRequest, acceptRequest, search, post_markRead} = require("../Controllers/home")

router.post("/mark-notification-read",is_authenticated, post_markRead)

router.get('/', index)
router.get("/friends-requests" ,is_authenticated,getfriendsRequests)
router.get("/:username",profile)
router.get("/:username/add-friend" ,is_authenticated,FriendRequest) // not implemented yet .
router.get('/chat/:username', is_authenticated, chat)
router.get('/remove-request/:id', is_authenticated, removeRequest)
router.get('/accept-request/:id', is_authenticated, acceptRequest)
router.get('/search/', search)


module.exports = router