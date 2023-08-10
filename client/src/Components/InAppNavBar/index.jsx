import './inAppNavbar.css';
import logo from '../../Assets/Img/logo-name.png'
import { useState } from 'react';
import { AiOutlineMenu, AiOutlineSearch, AiFillMessage, AiFillBell, AiOutlineCaretDown } from 'react-icons/ai';
import { HiInformationCircle } from 'react-icons/hi';
import { MdOutlineClose } from 'react-icons/md';

export default function InAppNavBar({ profile }) {
    const [toggleMenuList, setToggleMenuList] = useState(false);

    const logout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <>
            <nav>
                <div className="max-width">
                    <div className="inapp-nav-content">
                        <div className="menu-left">
                            <img className="logo" src={logo} alt="Logo" onClick={() => { window.location = "/" }} />
                            <div className="search-box">
                                <input type="text" className="search-input" id="search-input" placeholder="Search" />
                                <AiOutlineSearch className="search-icon-btn" />
                            </div>
                        </div>


                        <div className="small-screen-icons">
                            <a href="">
                                <AiOutlineSearch className="search-icon-small" />
                            </a>
                            <AiOutlineMenu className="menu-icon" onClick={() => setToggleMenuList(true)} />
                        </div>

                        <div className={toggleMenuList ? "menu-items active" : "menu-items"}>
                            <div className="close-icon-box">
                                <MdOutlineClose className="close-icon" onClick={() => setToggleMenuList(false)} />
                            </div>
                            <a href="" className="icon-links">
                                <AiFillMessage />
                                <span className="icon-names">Messages</span>
                            </a>
                            <a href="" className="icon-links">
                                <AiFillBell />
                                <span className="icon-names">Notifications</span>
                            </a>
                            <a href="" className="icon-links">
                                <HiInformationCircle />
                                <span className="icon-names">Information</span>
                            </a>
                            <div className="profile-menu-box">
                                <div className="profile-menu">
                                    <span>{profile}</span>
                                    <AiOutlineCaretDown />
                                </div>
                                <div className="dropdown-content">
                                    <p onClick={() => { window.location = "/profile" }}>{profile}</p>
                                    <p onClick={() => logout()}>Logout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}