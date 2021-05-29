function permission (req, res, next){
    if (req.session.user.id == req.params.id)
        next();
    else
        {
        req.session.destroy();
        res.redirect('/login')
        }
} 


module.exports = permission;