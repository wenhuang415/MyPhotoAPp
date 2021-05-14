const { response } = require("express");
var db = require("../conf/database");
const PostModel = {}

PostModel.create = (title, description, photoPath, thumbnail, fk_userId) => {
    let baseSQL = 'INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userid) VALUES (?,?,?,?,now(),?);';
        return db.query(baseSQL,[title, description, photoPath, thumbnail,fk_userId])
        .then(([results, fields]) => {
            return Promise.resolve(results && results.affectedRows);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
    let baseSQL ="SELECT id, title, description, thumbnail, concat_ws(' ',title, description)\
    FROM posts\
    WHERE title LIKE ? OR description LIKE ?;";
    let sqlReadySearchTerm = "%"+searchTerm+"%"
    let sqlReadySearchTerm2 ="%"+searchTerm+"%";
    return db.query(baseSQL,[sqlReadySearchTerm,sqlReadySearchTerm2])
    .then(([results, fields]) => {
        return Promise.resolve(results);//resolves results from the search
    })
    .catch((err) => Promise.reject(err));;
};

PostModel.getNRecentPosts = (numberOfPost) => {
    let baseSQL = 
    "SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT ?";
    return db.query(baseSQL, [numberOfPost]).then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
    let baseSQL =`SELECT u.username, p.title, p.description, p.photopath, p.created FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?;`;
      
    return db.query(baseSQL,[postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch(err => Promise.reject(err));
}

module.exports = PostModel;