var db = require('../conf/database');
const postMiddleware = {}

postMiddleware.getRecentPosts = function(req, res, next) {
    let baseSQL = 'SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 8';
    db.execute(baseSQL,[])
    .then(([results, fields]) => {
        res.locals.results = results;
        if(results && results.length == 0) {
            req.flash('error', 'There are no posts created yet');
        }
        next();
    })
    .catch((err) => next(err));
}

module.exports = postMiddleware;