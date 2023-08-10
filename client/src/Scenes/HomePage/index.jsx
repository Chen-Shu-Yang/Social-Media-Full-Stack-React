/* eslint-disable react/prop-types */
import './HomePage.css';
import { useEffect, useState } from 'react';
import ProfilCard from '../../Components/ProfileCard';
import CreatePostCard from '../../Components/CreatePostCard';
import FeedPostsCards from '../../Components/FeedPostsCards';
import FriendListCard from '../../Components/FriendListCard';
import SponsorshipCard from '../../Components/SponsorshipCard';

export default function HomePage() {
    const [postList, setPostList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [publicImgURL, setPublicImgURL] = useState("src/Assets/Img/");
    const [publicVidURL, setPublicVidURL] = useState("src/Assets/Video/");
    const [publicDocURL, setPublicDocURL] = useState("src/Assets/Doc/");
    const [publicAudURL, setPublicAudURL] = useState("src/Assets/Audio/");

    const [profilePic, setProfilePic] = useState(() => {
        const localProfilePic = localStorage.getItem("profilePic");
        return localProfilePic;
    });

    const [userId, setUserId] = useState(() => {
        const localUserId = localStorage.getItem("userId");
        return localUserId;
    });

    const [token, setToken] = useState(() => {
        const localToken = localStorage.getItem("token");
        return localToken;
    });

    async function loadFriendList() {
        const res = await fetch(`http://localhost:5000/user/${userId}/friends`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        let data = [];
        if (res.status === 401 || res.status === 403) {
            localStorage.clear();
            window.location = "/login";
            return;
        } else if (res.status !== 204) {
            data = await res.json();
        }

        setFriendList(data);
    }

    async function loadFeedPosts() {
        const res = await fetch(`http://localhost:5000/posts/${userId}`);
        const data = await res.json();

        setPostList(data);
    }

    async function deleteFriend(friendId) {
        await fetch(`http://localhost:5000/user/${userId}/${friendId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        loadFriendList();
    }

    async function likePost(postId) {
        if (postList.some(e => e.userLiked === true && e.POSTID === postId)) return;
        await fetch(`http://localhost:5000/posts/${postId}/like/${userId}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const newPostList = postList.map(post => {
            if (post.POSTID === postId) {
                return { ...post, LIKES: post.LIKES + 1, userLiked: true };
            }

            return post;
        });

        setPostList(newPostList);
    }

    async function dislikePost(postId) {
        await fetch(`http://localhost:5000/posts/${postId}/like/${userId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const newPostList = postList.map(post => {
            if (post.POSTID === postId) {
                return { ...post, LIKES: post.LIKES - 1, userLiked: false };
            }

            return post;
        });

        setPostList(newPostList);
    }

    useEffect(() => {
        loadFriendList();
        loadFeedPosts();
    }, []);

    return (
        <>
            <div className="home-container">
                <div className="max-width">
                    <div className="home-content">
                        <div className="cols-3 left-col">
                            <ProfilCard />
                        </div>
                        <div className="cols-3">
                            <CreatePostCard
                                profilePic={profilePic}
                                publicImgURL={publicImgURL}
                                loadFeedPosts={loadFeedPosts}
                            />
                            <FeedPostsCards
                                feedPosts={postList}
                                publicImgURL={publicImgURL}
                                publicVidURL={publicVidURL}
                                publicDocURL={publicDocURL}
                                publicAudURL={publicAudURL}
                                loadFeedPosts={loadFeedPosts}
                                likePost={likePost}
                                dislikePost={dislikePost}
                            />
                        </div>
                        <div className="cols-3 right-col">
                            <SponsorshipCard publicImgURL={publicImgURL} />
                            <FriendListCard friendList={friendList} publicImgURL={publicImgURL} deleteFriend={deleteFriend} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}