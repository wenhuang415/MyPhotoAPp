var PostModel = require('../models/Posts');
const postMiddleware = {}

postMiddleware.getRecentPosts = async function(req, res, next) {
    try {
        let results = await PostModel.getNRecentPosts(8);
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error', 'There are no post created yet');
        }
        next();
    }catch(err) {
        next(err);
    }
}

module.exports = postMiddleware;