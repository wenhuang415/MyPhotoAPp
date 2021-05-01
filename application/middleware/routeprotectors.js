const { succesPrint, errorPrint, successPrint } = require("../helpers/debug/debugprinters");
const routeProtectors = {};

routeProtectors.userIsLoggedIn = function(req, res, next) {
    if(req.session.username){
        successPrint('User is logged in');
        next();
    }else{
        errorPrint('User is not logged in');
        req.flash('error','Must be logged in to post!');
        res.redirect('/login');
    }
}

module.exports = routeProtectors;