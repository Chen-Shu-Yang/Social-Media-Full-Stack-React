import { useEffect, useState } from 'react';
import './commentSection.css';

export default function CommentSection({ publicImgURL, post }) {
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);

    async function loadCommentSection() {
        const res = await fetch(`http://localhost:5000/posts/${post.POSTID}/comments`);
        const data = await res.json();

        setComments(data);
    }

    const getDayDiff = (date) => {
        // To set two dates to two variables
        var date1 = new Date(date);
        var currentDate = new Date();

        // To calculate the ms difference of two dates
        let Difference_In_MS = currentDate.getTime() - date1.getTime();

        // To calculate the s difference of two dates
        let Difference_In_S = Math.round(Difference_In_MS / 1000);

        // To calculate the min difference of two dates
        let Difference_In_Min = Math.round(Difference_In_MS / 1000 / 60);

        // To calculate the hr difference of two dates
        let Difference_In_Hr = Math.round(Difference_In_MS / (1000 * 3600));

        // To calculate the no. of days between two dates
        let Difference_In_Days = Math.round(Difference_In_MS / (1000 * 3600 * 24));

        if (Difference_In_Days > 24) {
            return Difference_In_Days + "d ago";
        } else if (Difference_In_Hr > 1) {
            return Difference_In_Hr + "h ago";
        } else if (Difference_In_Min > 1) {
            return Difference_In_Min + "min ago";
        } else {
            return Difference_In_S + "s ago";
        }
    }

    useEffect(() => {
        loadCommentSection();
    }, []);

    return (
        <>
            <div className="comment-section">
                {/* 
                    The number in the className is determined by the level number in the db for comment table.
                    The adding and liking of comments will be inputing different values depending on the level of the comment.

                    "REPLY_TO" => Commenter replying to comment by COMMENTID
                */}

                {
                    comments.length > 0 ? (
                        <>
                            {
                                comments.map((comment, days) => {
                                    days = getDayDiff(comment.CREATED_ON)
                                    return (
                                        <div className="commenter-info-1" key={comment.COMMENTID}>
                                            <img src={`${publicImgURL}${comment.USER_PIC_PATH}`} alt="" />
                                            <div className="comment">
                                                <h5>{`${comment.FIRSTNAME} ${comment.LASTNAME}`}</h5>
                                                <span>{comment.COMMENT_CONTENT}</span>
                                                <div className="comment-eng">
                                                    <span className="comment-link">Like</span>
                                                    <span className="comment-link">Reply</span>
                                                    <span className="days">{days}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                    ) : (<p>No Comments Yet</p>)
                }
                {/* <div className="commenter-info-2">
                    <img src={`${publicImgURL}p2.jpeg`} alt="" />
                    <div className="comment">
                        <h5>huiling orchard</h5>
                        <a href="">@huiling orchard</a>
                        <span>This is a temporary comment line.</span>
                        <div className="comment-eng">
                            <span className="comment-link">Like</span>
                            <span className="comment-link">Reply</span>
                            <span className="days">1d</span>
                        </div>
                    </div>
                </div>
                <div className="commenter-info-3">
                    <img src={`${publicImgURL}p2.jpeg`} alt="" />
                    <div className="comment">
                        <h5>huiling orchard</h5>
                        <a href="">@huiling orchard</a>
                        <span>This is a temporary comment line.</span>
                        <div className="comment-eng">
                            <span className="comment-link">Like</span>
                            <span className="comment-link">Reply</span>
                            <span className="days">1d</span>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}