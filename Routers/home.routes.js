const router = require('express').Router();
const {is_authenticated} = require('./guard/auth.guard')
const {index, chat, profile, FriendRequest, getfriendsRequests,removeRequest, acceptRequest} = require("../Controllers/home")

router.get("/friends-requests" ,is_authenticated,getfriendsRequests)
router.get('/', index)
router.get("/:username",profile)
router.get("/:username/add-friend" ,is_authenticated,FriendRequest) // not implemented yet .
router.get('/chat/:username', is_authenticated, chat)
router.get('/remove-request/:id', is_authenticated, removeRequest)
router.get('/accept-request/:id', is_authenticated, acceptRequest)


module.exports = router