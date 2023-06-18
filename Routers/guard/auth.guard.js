const is_authenticated = (req, res, next) =>{
    if (req.session.user ){
        next()
    }else{
        res.redirect("/accounts/login")
    }
}

const is_not_authenticated = (req, res, next) =>{
    if (!req.session.user ){
        next()
    }else{
        res.redirect("/")
    }
}

module.exports = {
    is_authenticated,
    is_not_authenticated
}