const {CreateUser, Authenticate} = require("../db_methods/accounts")
const {sendFriendRequest, FirendShip, getReceiverFriendsRequests, senderFriendsRequests} = require("../db_methods/Friend")





const login = (req, res, next)=>{
    res.render('accounts/login', {title:"Login"})
}
const post_login = (req, res, next)=>{
    Authenticate(req.body.email, req.body.password).then(user=>{
        req.session.user = user
        res.redirect("/")
    }).catch(err=>{
        console.log(err)
    })
}

const register = (req, res, next)=>{
    res.render('accounts/register', {title:"Register"})
}

const post_register = (req, res, next)=>{

    CreateUser(req.body).then((user)=>{
        Authenticate(user.email, user.password).then(user=>{
            req.session.user = user
            res.redirect("/")
        }).catch(err=>{
            console.log(err)
            res.redirect("/accounts/register")
        })
    })
}

const logout = (req, res, next)=>{
    req.session.destroy();
    res.redirect("/accounts/login")
}




module.exports = {
    login,
    register,
    post_login,
    post_register,
    logout,
}