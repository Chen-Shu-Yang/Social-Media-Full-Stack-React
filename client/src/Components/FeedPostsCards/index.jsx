/* eslint-disable react/prop-types */
import { MdOutlineModeComment } from 'react-icons/md';
import { BsShareFill } from 'react-icons/bs';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import SinglePostModal from '../SinglePostModal';
import { useState } from 'react';

export default function FeedPostsCards({ feedPosts, publicImgURL, publicVidURL,
    publicDocURL, publicAudURL, likePost, dislikePost }) {
    const [openModal, setOpenModal] = useState(false);
    const [post, setPost] = useState();

    return (
        <>
            {openModal &&
                <SinglePostModal
                    closeModal={setOpenModal}
                    publicImgURL={publicImgURL}
                    post={post}
                />
            }
            
            {
                feedPosts.map(card => {
                    return (
                        <div className="content-cards" key={card.POSTID}>
                            <div className="post-display">
                                <div className="posts">
                                    <div className="poster-dtl">
                                        <div className="poster-profile">
                                            <img src={`${publicImgURL}${card.USER_PIC_PATH}`} alt={`${card.FIRSTNAME} ${card.LASTNAME} profile image`} />
                                            <div>
                                                <h5>{`${card.FIRSTNAME} ${card.LASTNAME}`}</h5>
                                                <span>{`${card.OCCUPATION}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post-content">
                                        <p className="post-des">
                                            {card.DESCRIPTION}
                                        </p>
                                        {
                                            card.PIC_PATH.split('.').pop() === "png" ||
                                                card.PIC_PATH.split('.').pop() === "jpg" ||
                                                card.PIC_PATH.split('.').pop() === "jpeg" ? (
                                                <img src={`${publicImgURL}${card.PIC_PATH}`} alt={`${card.FIRSTNAME} ${card.LASTNAME} post image`}
                                                    className="post-img" onDoubleClick={() => likePost(card.POSTID)} />
                                            ) : (
                                                card.PIC_PATH.split('.').pop() === "mp4" ? (
                                                    <video src={`${publicVidURL}${card.PIC_PATH}`} className="post-img" onDoubleClick={() => likePost(card.POSTID)} controls />
                                                ) : (
                                                    card.PIC_PATH.split('.').pop() === "pdf" ? (
                                                        <object data={`${publicDocURL}${card.PIC_PATH}`}
                                                            type="application/pdf" width="100%" height="500px">
                                                            <p>
                                                                Unable to display PDF file.
                                                                <a href={`${publicDocURL}${card.PIC_PATH}`}>Download</a>instead.
                                                            </p>
                                                        </object>
                                                    ) : (
                                                        card.PIC_PATH.split('.').pop() === "mp3" ||
                                                            card.PIC_PATH.split('.').pop() === "wav" ? (
                                                            <audio controls className="post-img">
                                                                <source src={`${publicAudURL}${card.PIC_PATH}`} type={`audio/${card.PIC_PATH.split('.').pop()}`} />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        ) : (
                                                            <></>
                                                        )
                                                    )
                                                )
                                            )
                                        }
                                    </div>
                                    <div className="post-eng">
                                        <div className="post-stats">
                                            <div className="post-like">
                                                {
                                                    card.userLiked ? (
                                                        <AiFillHeart className="post-icons liked-icon" onClick={() => dislikePost(card.POSTID)} />
                                                    ) : (
                                                        <AiOutlineHeart className="post-icons" onClick={() => likePost(card.POSTID)} />
                                                    )
                                                }
                                                <span>{card.LIKES}</span>
                                            </div>
                                            <div className="post-comment"
                                                onClick={() => {setPost(card);setOpenModal(true);}}>
                                                <MdOutlineModeComment className="post-icons" />
                                            </div>
                                        </div>
                                        <BsShareFill className="post-icons" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}