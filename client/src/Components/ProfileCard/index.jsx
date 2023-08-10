/* eslint-disable react/prop-types */
import { MdOutlineManageAccounts, MdOutlineLocationOn, MdModeEditOutline } from 'react-icons/md';
import { BsBriefcase, BsTwitter, BsLinkedin, BsFillCameraFill } from 'react-icons/bs';
import { FiCheck } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';

export default function ProfilCard() {
    const [friendList, setFriendList] = useState([]);
    const [publicImgURL, setPublicImgURL] = useState("src/Assets/Img/");
    const editPicFile = useRef(null);
    const [firstName, setFirstName] = useState(() => {
        const localFirstName = localStorage.getItem("firstName");
        return localFirstName;
    });

    const [lastName, setLastName] = useState(() => {
        const localLastName = localStorage.getItem("lastName");
        return localLastName;
    });

    const [impressions, setImpressions] = useState(() => {
        const localImpressions = localStorage.getItem("impressions");
        return localImpressions;
    });

    const [viewedProfile, setViewedProfile] = useState(() => {
        const localViewedProfile = localStorage.getItem("viewedProfile");
        return localViewedProfile;
    });

    const [location, setLocation] = useState(() => {
        const localLocation = localStorage.getItem("location");
        return localLocation;
    });

    const [occupation, setOccupation] = useState(() => {
        const localOccupation = localStorage.getItem("occupation");
        return localOccupation;
    });

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

    const [editProfile, setEditProfile] = useState(false);

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
        } else if (res.status !== 204) {
            data = await res.json();
        }

        setFriendList(data);
    }

    function mediaCheck(img) {
        const profilePicCheck = img.split('.').pop();
        if (profilePicCheck === "png" || profilePicCheck === "jpeg" || profilePicCheck === "jpg") {
            setProfilePic(img);
        } else {
            alert("Only Accepts PNG, JPG, or JPEG image files");
        }
    }

    async function saveProfileEdit() {
        if (location !== localStorage.getItem("location")
            || occupation !== localStorage.getItem("occupation")
            || firstName !== localStorage.getItem("firstName")
            || lastName !== localStorage.getItem("lastName")
            || profilePic !== localStorage.getItem("profilePic")) {
            const res = await fetch(`http://localhost:5000/user/profile/${userId}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ firstName, lastName, location, occupation, profilePic })
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.clear();
                window.location = "/login";
                return;
            } else {
                const affectedRows = await res.json();
                if (affectedRows.msg === 1) {
                    localStorage.setItem("firstName", firstName);
                    localStorage.setItem("lastName", lastName);
                    localStorage.setItem("occupation", occupation);
                    localStorage.setItem("location", location);
                    localStorage.setItem("profilePic", profilePic);

                    window.location.reload();
                }
            }
        }

        setEditProfile(false);
    }

    useEffect(() => {
        loadFriendList();
    }, []);

    return (
        <>
            <div className="content-cards">
                <div className="profile-section">
                    <div className="profile-info">
                        <div className="profile-img-box">
                            <img src={`${publicImgURL}${profilePic}`} alt="" />
                            {
                                editProfile ? (
                                    <>
                                        <div className="profile-pic-overlap"></div>
                                        <BsFillCameraFill className="edit-profile-pic-icon" onClick={() => editPicFile.current.click()} />
                                        <input type="file" ref={editPicFile} onChange={e => mediaCheck(e.target.files[0].name)} hidden />
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={editProfile ? "edit-name-box" : ""}>
                            {
                                editProfile ? (
                                    <div>
                                        <input className="edit-profile-input nameEditInput" type="text" value={firstName}
                                            onChange={e => setFirstName(e.target.value)} />

                                        <input className="edit-profile-input nameEditInput" type="text" value={lastName}
                                            onChange={e => setLastName(e.target.value)} />
                                    </div>

                                ) : (
                                    <h4>{firstName} {lastName}</h4>
                                )
                            }
                            <span>{friendList.length} friends</span>
                        </div>
                    </div>
                    {
                        editProfile ? (
                            <FiCheck className="profile-icons" onClick={() => saveProfileEdit()} />
                        ) : (
                            <MdOutlineManageAccounts className="profile-icons" onClick={() => setEditProfile(true)} />
                        )
                    }
                </div>
                <div className="user-dtl">
                    <div className="location">
                        <MdOutlineLocationOn className="profile-icons" />
                        {
                            editProfile ? (
                                <input className="edit-profile-input" type="text"
                                    value={location} onChange={e => setLocation(e.target.value)} />
                            ) : (
                                <span>{location}</span>
                            )
                        }
                    </div>
                    <div className="job">
                        <BsBriefcase className="profile-icons" />
                        {
                            editProfile ? (
                                <input className="edit-profile-input" type="text"
                                    value={occupation} onChange={e => setOccupation(e.target.value)} />
                            ) : (
                                <span>{occupation}</span>
                            )
                        }
                    </div>
                </div>
                <div className="profile-stats">
                    <div className="profile-views">
                        <span>Who&apos;s viewed your profile</span>
                        <span className="stats-num">{viewedProfile}</span>
                    </div>
                    <div className="profile-views">
                        <span>Impressions of your post</span>
                        <span className="stats-num">{impressions}</span>
                    </div>
                </div>
                <div className="social-profiles">
                    <h4>Social Profiles</h4>
                    <div className="socials">
                        <div className="social-names">
                            <BsTwitter className="social-icons" />
                            <div>
                                <p className="twitter-bold">Twitter</p>
                                <span>Social Network</span>
                            </div>
                        </div>
                        <MdModeEditOutline className="edit-social-icon" />
                    </div>
                    <div className="socials">
                        <div className="social-names">
                            <BsLinkedin className="social-icons" />
                            <div>
                                <p className="linkedin-bold">LinkedIn</p>
                                <span>Network Platform</span>
                            </div>
                        </div>
                        <MdModeEditOutline className="edit-social-icon" />
                    </div>
                </div>
            </div>
        </>
    );
}