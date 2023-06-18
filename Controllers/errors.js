const NotFound404 = (req, res)=>{
    res.render('Errors/404', {title: 'Not Found'});
}

module.exports = {
    NotFound404
}