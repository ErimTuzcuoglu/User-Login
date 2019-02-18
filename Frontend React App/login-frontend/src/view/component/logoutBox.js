import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { updateUser } from '../../controllers/nodeApiController';


export default class LogoutBox extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false }
        this.logoutFunc = this.logoutFunc.bind(this);
    }
    
    logoutFunc() {
        updateUser(this.userInfo._id, {online: false}).then(function(res) {
            if(res.status == 200){
                localStorage.clear();
                window.location.reload(false);
            } else {
                alert("Hata: " + res.status)
            }
            
        }.bind(this))
    }

    render() {
        this.userInfo = JSON.parse(localStorage.getItem("userData"))
        return (
            <div>
                <h3>Merhaba, Hoş Geldiniz {this.userInfo.name + " " +  this.userInfo.surname}</h3>
                <Button size="sm" color="success" style={style.inputStyle} onClick={this.logoutFunc}>Çıkış Yap - Logout</Button>
            </div>
        );
    }
}
const style = {
    inputStyle: {
        width: '50%',
        margin: 'auto',
        marginTop: 10
    }
}
