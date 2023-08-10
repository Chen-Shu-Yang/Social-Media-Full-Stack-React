import { MdOutlineClose, MdSend } from 'react-icons/md';
import './singlePostModal.css';
import CommentSection from '../CommentSection';
import { useState, useEffect } from 'react';

export default function SinglePostModal({ closeModal, publicImgURL, post }) {
    const [publicMediaURL, setPublicMediaURL] = useState("");
    const [mediaExt, setMediaExt] = useState(post.PIC_PATH.split('.').pop());

    function toggleMedia() {
        if (mediaExt === "png" || mediaExt === "jpg" || mediaExt === "jpeg") {
            setPublicMediaURL("src/Assets/Img/");
        } else if (mediaExt === "mp4") {
            setPublicMediaURL("src/Assets/Video/");
        } else if (mediaExt === "pdf") {
            setPublicMediaURL("src/Assets/Doc/")
        } else if (mediaExt === "mp3" || mediaExt === "wav") {
            setPublicMediaURL("src/Assets/Audio/");
        } else {
            alert("Media Type not supported");
        }
    }

    useEffect(() => {
        toggleMedia();
    }, []);

    return (
        <>
            <div className="modal-bg" onClick={() => closeModal(false)}></div>
            <div className="modal-container">
                <div className="modal-title">
                    <h2>{`${post.FIRSTNAME} ${post.LASTNAME}`} Post</h2>
                    <button onClick={() => closeModal(false)}><MdOutlineClose /></button>
                </div>
                <div className="modal-body">
                    <div className="poster-dtl">
                        <div className="poster-profile">
                            <img src={`${publicImgURL}${post.USER_PIC_PATH}`} alt="" />
                            <div>
                                <h5>{`${post.FIRSTNAME} ${post.LASTNAME}`}</h5>
                                <span>{post.CREATED_ON}</span>
                            </div>
                        </div>
                    </div>
                    <p className="post-des">{post.DESCRIPTION}</p>
                    {
                        mediaExt === "png" || mediaExt === "jpg" || mediaExt === "jpeg" ? (
                            <img src={`${publicMediaURL}${post.PIC_PATH}`} alt={`${post.FIRSTNAME} ${post.LASTNAME} post image`}
                                className="post-media" />
                        ) : (
                            mediaExt === "mp4" ? (
                                <video src={`${publicMediaURL}${post.PIC_PATH}`} className="post-media" controls />
                            ) : (
                                mediaExt === "pdf" ? (
                                    <object data={`${publicMediaURL}${post.PIC_PATH}`}
                                        type="application/pdf" width="100%" height="500px">
                                        <p>
                                            Unable to display PDF file.
                                            <a href={`${publicMediaURL}${post.PIC_PATH}`}>Download</a>instead.
                                        </p>
                                    </object>
                                ) : (
                                    mediaExt === "mp3" || mediaExt === "wav" ? (
                                        <audio controls className="post-media">
                                            <source src={`${publicMediaURL}${post.PIC_PATH}`} type={`audio/${mediaExt}`} />
                                            Your browser does not support the audio element.
                                        </audio>
                                    ) : (
                                        <></>
                                    )
                                )
                            )
                        )
                    }
                    <CommentSection publicImgURL={publicImgURL} post={post} />
                </div>
                <div className="modal-footer">
                    <div className="poster-profile">
                        <img src={`${publicImgURL}${post.USER_PIC_PATH}`} alt="" />
                        <div className="comment-box">
                            <input type="text" className="ssInput" placeholder="Leave a Comment Here..." />
                            <MdSend className="send-icon" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}