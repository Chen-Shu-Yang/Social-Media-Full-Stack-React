/* IMPORTS */
import pool from "../controller/databaseConfig.js";

/* MODEL OBJECT & LOGIC */
const User = {
    // Register User
    register(firstName, lastName, email, password, picturePath,
        location, occupation, viewedProfile, impressions, callback) {
        // sql query statement
        const sql = `
            INSERT INTO 
                social_media.users (
                    FIRSTNAME, LASTNAME, EMAIL, PASSWORD, PIC_PATH, 
                    LOCATION, OCCUPATION, VIEWED_PROFILE, IMPRESSIONS
                )
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        // pool query
        pool.query(sql, [
            firstName, lastName, email, password, picturePath,
            location, occupation, viewedProfile, impressions
        ], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            // result accurate
            return callback(null, result);
            // pool.end()
        });
    },
    
    // Find User by Email
    findUser(email, callback) {
        // sql query statement
        const sql = `SELECT * FROM social_media.users WHERE EMAIL = ?`;
        // pool query
        pool.query(sql, [email], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback (null, result);
        });
    },

    // Find User by Id
    findById(userId, callback) {
        // sql query statement
        const sql = `SELECT * FROM social_media.users WHERE USERID = ?`;
        // pool query
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback (null, result);
        });
    },

    // Find User Friends by UserId
    getFriends(userId, callback) {
        // sql query statement
        const sql = `
            SELECT
                F.USERID, F.FRIENDS_WITH, U.USERID AS 'FRIENDID', U.FIRSTNAME AS 'FRIEND_FIRSTNAME', 
                U.LASTNAME AS 'FRIEND_LASTNAME', U.PIC_PATH, U.LOCATION, U.OCCUPATION
            FROM
                social_media.friends AS F,
                social_media.users AS U
            WHERE
                U.USERID = F.FRIENDS_WITH AND F.USERID = ?;
        `;
        // pool query
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback (null, result);
        });
    },

    // Update User Profile
    updateUserProfile(
        userId,
        firstName,
        lastName,
        location,
        occupation,
        profilePic,
        callback) {
            // sql query statement
            const sql = `
                UPDATE
                    social_media.users
                SET
                    FIRSTNAME = ?, LASTNAME = ?, LOCATION = ?, OCCUPATION = ?, PIC_PATH = ?
                WHERE 
                    USERID = ?
            `;
            // pool query
            pool.query(sql, [firstName, lastName, location, occupation, profilePic, userId], (err, result) => {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                return callback (null, result);
            });
    },

    // Add New Friends
    addFriend(userId, friendId, callback) {
        // sql query statement
        const sql = `
            INSERT INTO 
                social_media.friends (
                    USERID,
                    FRIENDS_WITH
                )
            VALUES 
                (?, ?);
        `;
        // pool query
        pool.query(sql, [userId, friendId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback (null, result);
        });
    },

    // Delete a Friend
    deleteFriend(userId, friendId, callback) {
        // sql query statement
        const sql = `
            DELETE FROM
                social_media.friends
            WHERE 
                USERID = ? AND FRIENDS_WITH = ?;
        `;
        // pool query
        pool.query(sql, [userId, friendId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback (null, result);
        });
    }
}

/* EXPORTS */
export default User;