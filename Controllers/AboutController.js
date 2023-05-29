

const problem = (req, res, next)=>{
	res.render("About/problem", {title:"problem"})
}

const index = (req, res, next)=>{
	res.render("About/index", {title:"Home"})
}


module.exports = {
    problem
}