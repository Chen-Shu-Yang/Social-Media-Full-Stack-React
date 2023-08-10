import './registerPage.css';

export default function RegisterPage() {
    return (
        <>
            <div className="register-container">
                <div className="max-width">
                    <div className="register-content">
                        <div className="register-card">
                            <p>Welcome to SocialHop, the Social Media for your Social Hope</p>
                            <div className="input-grp">
                                <label htmlFor="firstName">
                                    <input type="text" id="firstName" placeholder="First Name" />
                                </label>
                                <label htmlFor="lastName">
                                    <input type="text" id="lastName" placeholder="Last Name" />
                                </label>
                            </div>
                            <label htmlFor="location">
                                <input type="text" id="location" placeholder="Location" />
                            </label>
                            <label htmlFor="occupation">
                                <input type="text" id="occupation" placeholder="Occupation" />
                            </label>
                            <label htmlFor="profilePic">
                                <input type="file" id="profilePic" />
                            </label>
                            <label htmlFor="email">
                                <input type="text" id="email" placeholder="Email" />
                            </label>
                            <label htmlFor="password">
                                <input type="text" id="password" placeholder="Password" />
                            </label>
                            <button className="register-btn">Register</button>
                            <a href="/login">Already have an account? Login here!</a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}