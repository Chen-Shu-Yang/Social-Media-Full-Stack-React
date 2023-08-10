import './navbar.css';
import logo from '../../Assets/Img/logo-name.png'

export default function NavBar() {
    return (
        <>
            <nav>
                <div className="max-width">
                    <div className="nav-content">
                        <img className="logo" src={logo} alt="Logo" />
                    </div>
                </div>
            </nav>
        </>
    )
}