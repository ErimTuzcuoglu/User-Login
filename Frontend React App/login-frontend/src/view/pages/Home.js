import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import LoginBox from '../component/loginBox';
import LogoutBox from '../component/logoutBox';


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "" }
        // this.state = { userInfo: null };
    }

    render() {
        document.title = "Anasayfa - Home"
        var userInfo = JSON.parse(localStorage.getItem("userData"))
        return (
            <div className="App" style={{ marginTop: '5%' }}>
                {userInfo != (undefined || '' || null) ? <LogoutBox /> : <div>
                    <LoginBox /><br />
                    <Link to={{ pathname: "/forgotpass" }} style={style.linkStyle}>Şifremi unuttum  (I Forgot my password)</Link><br />
                    <Link to={{ pathname: "/signup" }} style={style.linkStyle}>Kaydol / Signup</Link>
                </div>
                }
                <br />{((userInfo != null) && (userInfo.userType == "Admin")) ? <Link to={{ pathname: "/admin" }} style={style.linkStyle}>Admin Sayfası</Link> : ""}
            </div>
        );
    }
}
const style = {
    linkStyle: {
        textDecoration: "none",
        fontSize: 15
    }
}
