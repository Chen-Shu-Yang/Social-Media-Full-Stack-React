/* IMPORTS */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import User from "../model/user.js";
import Post from "../model/post.js";
import { verifyToken } from "../middleware/auth.js";

/* CONFIGURATIONS */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// Sets the directory of where we keep our assets
// In this case, the images
// This method stores the assets locally. 
// However, in production they should be stored in an actual storage file directory
// or a cloud storage such as AWS S3
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Variable will be used when uploading a file
const upload = multer({ storage });

/* REGISTER & LOGIN APIs */
// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // For convenience of this project
        const viewedProfile = Math.floor(Math.random() * 10000);
        const impressions = Math.floor(Math.random() * 10000);

        User.register(
            firstName,
            lastName,
            email,
            passwordHash,
            picturePath,
            location,
            occupation,
            viewedProfile,
            impressions,
            (err, result) => {
                if (!err) {
                    res.status(201).send({ msg: "Successfully Registered" });
                } else {
                    res.status(401).send({ msg: "Registeration Failed" });
                }
            })
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        User.findUser(email, (err, result) => {
            if (!err) {
                if (result.length <= 0) {
                    res.status(404).send({ msg: "User does not exist!" });
                } else {
                    bcrypt.compare(password, result[0].PASSWORD, (err, compare_res) => {
                        if (err) {
                            res.status(400).send({ error: err });
                        }

                        if (compare_res) {
                            // generate the token
                            // JWT is only a very basic way of authentication
                            // In most companies, authentications may be passed to a
                            // third party or done by a seperate independent team
                            const token = jwt.sign(
                                {
                                    // (1)Payload
                                    // email: user[0].email,
                                    id: result[0].USERID,
                                },
                                // (2) Secret Key
                                process.env.JWT_SECRET,
                                // (3) Lifetime of a token
                                {
                                    // expires in 24 hrs
                                    expiresIn: 86400,
                                },
                            );

                            delete result[0].PASSWORD;
                            let data = {
                                ...result[0],
                                token
                            };

                            res.status(200).send(data);
                        } else {
                            res.status(400).send({ msg: "Invalid Password!" });
                        }
                    });
                }
            } else {
                res.status(500).send(err);
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }

});

/* USER APIs */
// Get Users by ID
app.get("/user/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        User.findById(id, (err, result) => {
            if (!err) {
                delete result[0].PASSWORD;
                res.status(200).send(result[0]);
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get User friends by ID
app.get("/user/:id/friends", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        User.findById(id, (err, result) => {
            if (!err) {
                const userId = result[0].USERID;

                User.getFriends(userId, (err2, friends) => {
                    if (!err) {
                        if (friends.length <= 0) {
                            console.log(friends);
                            res.status(204).send();
                        } else {
                            res.status(200).send(friends);
                        }
                    } else {
                        res.status(500).send({ error: err2 });
                    }
                });
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update User Profile Dtls
app.put("/user/profile/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, location, occupation, profilePic } = req.body;
        console.log(req.body);
        User.updateUserProfile(
            userId,
            firstName,
            lastName,
            location,
            occupation,
            profilePic,
            (err, result) => {
                if (!err) {
                    res.status(201).send({ msg: result.affectedRows });
                } else {
                    res.status(500).send({ error: err });
                }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Add User friends by UserID & FriendID
app.post("/user/:id/:friendId", verifyToken, async (req, res) => {
    try {
        const { id, friendId } = req.params;
        User.addFriend(id, friendId, (err, result) => {
            if (!err) {
                res.status(201).send({ msg: result.affectedRows });
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Delete User friends by UserID & FriendID
app.delete("/user/:id/:friendId", verifyToken, async (req, res) => {
    try {
        const { id, friendId } = req.params;
        User.deleteFriend(id, friendId, (err, result) => {
            if (!err) {
                if (result.affectedRows <= 0) {
                    res.status(200).send({ msg: "Friends Record not found" });
                } else {
                    res.status(202).send({ msg: result.affectedRows });
                }
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

/* POST APIs */
// Get Feed Posts With User Liked Posts
app.get("/posts/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        Post.getFeedPosts((err, result) => {
            if (!err) {
                if (result.length <= 0) {
                    res.status(204).send({ msg: "No feed posts found" });
                } else {
                    Post.userLikedPosts(userId, (err, userLiked) => {
                        if (!err) {
                            if (userLiked.length <= 0) {
                                res.status(204).send({ msg: 'No Posts Liked By User' });
                            } else {
                                for (let i = 0; i < result.length; i++) {
                                    for (let j = 0; j < userLiked.length; j++) {
                                        if (userLiked[j].POSTID === result[i].POSTID) {
                                            result[i] = { ...result[i], userLiked: true };
                                            break;
                                        } else {
                                            result[i] = { ...result[i], userLiked: false };
                                        }
                                    }
                                }
                                res.status(200).send(result);
                            }
                        } else {
                            res.status(500).send({ error: err });
                        }
                    });
                }
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get User Posts
app.get("/posts/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        Post.getFeedPostsByUserId(userId, (err, result) => {
            if (!err) {
                if (result.length <= 0) {
                    res.status(204).send();
                }
                res.status(200).send(result);
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Create New Posts
app.post("/posts/new/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { postDes, mediaPath } = req.body;
        Post.createFeedPost(userId, postDes, mediaPath, (err, result) => {
            if (!err) {
                res.status(200).send({ msg: result.affectedRows });
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Like Posts
app.post("/posts/:postId/like/:userId", verifyToken, async (req, res) => {
    try {
        const { postId, userId } = req.params;
        Post.likePost(postId, userId, (err, result) => {
            if (!err) {
                res.status(201).send({ msg: result.affectedRows });
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Dislike Posts
app.delete("/posts/:postId/like/:userId", verifyToken, async (req, res) => {
    try {
        const { postId, userId } = req.params;
        Post.dislikePost(postId, userId, (err, result) => {
            if (!err) {
                res.status(201).send({ msg: result.affectedRows });
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Get Comments by postId
app.get("/posts/:postId/comments", async (req, res) => {
    try {
        const { postId } = req.params;
        Post.getComments(postId, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Add Comments by UserId
app.post("/posts/:postId/comments/:userId", verifyToken, async (req, res) => {
    try {
        const { postId, userId } = req.params;
        const { comment } = req.body;

        Post.addComment(postId, userId, comment, (err, result) => {
            if (!err) {
                res.status(201).send({ msg: result.affectedRows });
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Delete Comments by CommentId & UserId
app.delete("/comments/:commentId/commenter/:userId", verifyToken, async (req, res) => {
    try {
        const { commentId, userId } = req.params;

        Post.deleteComment(commentId, userId, (err, result) => {
            if (!err) {
                res.status(201).send({ msg: result.affectedRows });
            } else {
                res.status(500).send({ error: err });
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

/* EXPORTS */
export default app;