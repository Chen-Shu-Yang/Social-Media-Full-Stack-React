import { useState } from 'react';
import './loginPage.css';

export default function LoginPage() {
    const [errMsg, setErrMsg] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();

        try {
            const body = {
                email: e.target.userEmail.value,
                password: e.target.userPassword.value
            };

            const res = await fetch(`http://localhost:5000/login`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const userDtls = await res.json();
            console.log(userDtls);

            if (res.status === 404 || res.status === 400) {
                alert(userDtls.msg);
            } else {
                localStorage.setItem("firstName", `${userDtls.FIRSTNAME}`);
                localStorage.setItem("lastName", `${userDtls.LASTNAME}`);
                localStorage.setItem("userId", userDtls.USERID);
                localStorage.setItem("impressions", userDtls.IMPRESSIONS);
                localStorage.setItem("viewedProfile", userDtls.VIEWED_PROFILE);
                localStorage.setItem("location", userDtls.LOCATION);
                localStorage.setItem("email", userDtls.EMAIL);
                localStorage.setItem("occupation", userDtls.OCCUPATION);
                localStorage.setItem("profilePic", userDtls.PIC_PATH);
                localStorage.setItem("token", userDtls.token);

                window.location = "/";
            }
        } catch (err) {
            setErrMsg(err);
        }
    }


    return (
        <>
            <div className="login-container">
                <div className="max-width">
                    <div className="login-content">
                        {errMsg}
                        <form className="login-card" onSubmit={onSubmitForm}>
                            <p>Welcome to SocialHop, the Social Media for your Social Hope</p>
                            <label htmlFor="userEmail">
                                <input type="email" id="userEmail" placeholder="Email" autoComplete="off" />
                            </label>
                            <label htmlFor="userPassword">
                                <input type="password" id="userPassword" placeholder="Password" />
                            </label>
                            <button className="login-btn">Login</button>
                            <a href="/register">Don't have an account? Sign up here now!</a>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}