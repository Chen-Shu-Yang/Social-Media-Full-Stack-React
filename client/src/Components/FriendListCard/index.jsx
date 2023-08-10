/* eslint-disable react/prop-types */
import { AiOutlineUserDelete } from 'react-icons/ai';

export default function FriendListCard({ friendList, publicImgURL, deleteFriend }) {
    return (
        <>
            <div className="content-cards">
                <div className="friend-card-title">
                    <h4>Friend List</h4>
                    <a href="/friends">List All</a>
                </div>
                <div className="friend-list">
                    {
                        friendList.length > 0 ? (
                            friendList.slice(0, 3).map((friend) => {
                                return (
                                    <div className="friend-list-item" key={friend.FRIENDID}>
                                        <div className="friend-dtl">
                                            <img src={`${publicImgURL}${friend.PIC_PATH}`} alt="friend profile image" />
                                            <div>
                                                <h5>{`${friend.FRIEND_FIRSTNAME} ${friend.FRIEND_LASTNAME}`}</h5>
                                                <span>{friend.OCCUPATION}</span>
                                            </div>
                                        </div>
                                        <AiOutlineUserDelete className="del-friend-icon" onClick={() => deleteFriend(friend.FRIENDID)} />
                                    </div>
                                )
                            })
                        ) : (
                            <span>0 Friends</span>
                        )
                    }

                </div>
            </div>
        </>
    )
}