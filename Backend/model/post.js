/* IMPORTS */
import pool from "../controller/databaseConfig.js";

/* MODEL OBJET & LOGIC */
const Post = {
    // Get feed posts
    getFeedPosts(callback) {
        // sql query statement
        const sql = `
            SELECT
                P.POSTID, U.USERID, U.FIRSTNAME, U.LASTNAME, U.LOCATION, U.OCCUPATION,
                P.DESCRIPTION, U.PIC_PATH AS "USER_PIC_PATH", P.PIC_PATH,
                P.CREATED_ON, P.UPDATED_ON, COUNT(L.POSTID) AS LIKES
            FROM
                social_media.users AS U,
                social_media.posts AS P
            LEFT JOIN
                social_media.post_likes AS L ON P.POSTID = L.POSTID
            WHERE
                U.USERID = P.USERID
            GROUP BY
                P.POSTID
            ORDER BY P.CREATED_ON DESC
        `;
        // pool query
        pool.query(sql, [], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Get feed posts by UserId
    getFeedPostsByUserId(userId, callback) {
        // sql query statement
        const sql = `
            SELECT
                P.POSTID, U.USERID, U.FIRSTNAME, U.LASTNAME, U.LOCATION, U.OCCUPATION,
                P.DESCRIPTION, U.PIC_PATH AS "USER_PIC_PATH", P.PIC_PATH,
                P.CREATED_ON, P.UPDATED_ON, COUNT(L.POSTID) AS LIKES
            FROM
                social_media.users AS U,
                social_media.posts AS P
            LEFT JOIN
                social_media.post_likes AS L ON P.POSTID = L.POSTID
            WHERE
                U.USERID = P.USERID AND U.USERID = ?
            GROUP BY
                P.POSTID
            ORDER BY P.CREATED_ON DESC
        `;
        // pool query
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Create new feed post by UserId
    createFeedPost(userId, postDes, mediaPath, callback) {
        // sql query statement
        const sql = `
            INSERT INTO
                social_media.posts (USERID, DESCRIPTION, PIC_PATH)
            VALUES
                (?, ?, ?)
        `;
        // pool query
        pool.query(sql, [userId, postDes, mediaPath], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Like a Post
    likePost(postId, userId, callback) {
        // sql query statement
        const sql = `
            INSERT INTO 
                social_media.post_likes (POSTID, LIKER)
            VALUES 
                (?, ?)
        `;
        // pool query
        pool.query(sql, [postId, userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Dislike a Post
    dislikePost(postId, userId, callback) {
        // sql query statement
        const sql = `DELETE FROM social_media.post_likes WHERE POSTID = ? AND LIKER = ?`;
        // pool query
        pool.query(sql, [postId, userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Check for posts liked by user by UserId
    userLikedPosts(userId, callback) {
        // sql query statement
        const sql = `SELECT * FROM social_media.post_likes WHERE LIKER = ?`;
        // pool query
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Check duplicate likes by userId
    userLikedPosts(userId, callback) {
        // sql query statement
        const sql = `SELECT * FROM social_media.post_likes WHERE LIKER = ?`;
        // pool query
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Get all comments by postId
    getComments(postId, callback) {
        // sql query statement
        const sql = `
            SELECT
                C.COMMENTID, C.COMMENTER, U.FIRSTNAME, U.LASTNAME, U.LOCATION,
                C.COMMENT_CONTENT, U.PIC_PATH AS "USER_PIC_PATH", C.CREATED_ON
            FROM
                social_media.users AS U,
                social_media.comments AS C
            WHERE
                U.USERID = C.COMMENTER AND C.POSTID = ?
            ORDER BY
                CREATED_ON ASC
        `;
        // pool query
        pool.query(sql, [postId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Add Comments by UserId
    addComment(postId, userId, comment, callback) {
        // sql query statement
        const sql = `
            INSERT INTO
                social_media.comments (POSTID, COMMENTER, COMMENT_CONTENT)
            VALUES
                (?, ?, ?);
        `;
        // pool query
        pool.query(sql, [postId, userId, comment], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },

    // Delete Comments by CommentId & UserId
    deleteComment(commentId, userId, callback) {
        // sql query statement
        const sql = `DELETE FROM social_media.comments WHERE COMMENTID = ? AND COMMENTER = ?;`;
        // pool query
        pool.query(sql, [commentId, userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },
};

/* EXPORTS */
export default Post;