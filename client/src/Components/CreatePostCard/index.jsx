/* eslint-disable react/prop-types */
import { MdMusicVideo } from 'react-icons/md';
import { BsImage, BsPaperclip, BsFillTrash3Fill } from 'react-icons/bs';
import { AiFillAudio } from 'react-icons/ai';
import { useState /*, useCallback */ } from 'react';
import Dropzone/* , { useDropzone } */ from 'react-dropzone';

export default function FeedPostsCol({ profilePic, publicImgURL, loadFeedPosts }) {
    const [dropMedia, setDropMedia] = useState([]);
    const [dropbox, setDropbox] = useState(false);
    const [postDes, setPostDes] = useState("");
    const [mediaType, setMediaType] = useState("");

    const [userId, setUserId] = useState(() => {
        const localUserId = localStorage.getItem("userId");
        return localUserId;
    });

    const [token, setToken] = useState(() => {
        const localToken = localStorage.getItem("token");
        return localToken;
    });

    async function createNewPost(e) {
        e.preventDefault();
        
        const res = await fetch(`http://localhost:5000/posts/new/${userId}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "postDes": postDes,
                "mediaPath": dropMedia[0].name
            })
        });

        setDropMedia([]);
        setPostDes("");
        loadFeedPosts();
    }

    async function mediaCheck(file) {
        const mediaFileExt = file[0].name.split('.').pop();
        if (mediaType === "img") {
            if (mediaFileExt === "png" || mediaFileExt === "jpg" || mediaFileExt === "jpeg") return setDropMedia(file);
            if (confirm("Please Select a png, jpg, or jpeg image")) {
                setDropMedia([]);
            }
        } else if (mediaType === "vid") {
            if (mediaFileExt === "mp4") return setDropMedia(file);
            if (confirm("Please Select a mp4 video")) {
                setDropMedia([]);
            }
        } else if (mediaType === "doc") {
            if (mediaFileExt === "pdf") return setDropMedia(file);
            if (confirm("Please Select a pdf file")) {
                setDropMedia([]);
            }
        } else if (mediaType === "aud") {
            if (mediaFileExt === "mp3" || mediaFileExt === "wav") return setDropMedia(file);
            if (confirm("Please Select a mp3, wav audio file")) {
                setDropMedia([]);
            }
        } else {
            alert("Please Select a supported media type");
        }
    }
    
    function openDropBox(media) {
        setDropbox(true);
        setMediaType(media);
    }

    return (
        <>
            <div className="content-cards create-post-card">
                <form className="create-post" onSubmit={e => createNewPost(e)}>
                    <div className="post-des-input">
                        <img src={`${publicImgURL}${profilePic}`} alt="user profile picture" />
                        <input type="text" className="ssInput" placeholder="What's on your mind..." value={postDes}
                            onChange={e => setPostDes(e.target.value)} />
                    </div>
                    {dropbox ? (
                        <Dropzone onDrop={acceptedFiles => mediaCheck(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {dropMedia.length <= 0 ? (
                                        <div className="dropzone">
                                            <span>Drag 'n' drop some files here, or click to select files</span>
                                        </div>
                                    ) : (
                                        <div className="dropzone dropzone-content">
                                            <span>{dropMedia[0].name}</span>
                                            <BsFillTrash3Fill onClick={() => setDropMedia([])} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </Dropzone>
                    ) : (
                        <></>
                    )}

                    <div className="create-posts-btns">
                        <div className="btn-5 img-drop" onClick={() => openDropBox("img")}>
                            <BsImage className="create-post-icons" />
                            <span>Image</span>
                        </div>
                        <div className="btn-5 vid-drop" onClick={() => openDropBox("vid")}>
                            <MdMusicVideo className="create-post-icons" />
                            <span>Clip</span>
                        </div>
                        <div className="btn-5 doc-drop" onClick={() => openDropBox("doc")}>
                            <BsPaperclip className="create-post-icons" />
                            <span>Attachment</span>
                        </div>
                        <div className="btn-5 aud-drop" onClick={() => openDropBox("aud")}>
                            <AiFillAudio className="create-post-icons" />
                            <span>Audio</span>
                        </div>
                        <div className="btn-5">
                            <button>Post</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}