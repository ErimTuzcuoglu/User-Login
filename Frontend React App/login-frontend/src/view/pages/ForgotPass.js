import React, { Component } from 'react';
import {
    Input,
    Button,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import { sendResetMail } from '../../controllers/nodeApiController';

export default class ForgotPass extends Component {

    constructor(props) {
        super(props);
        this.state = { email: "", redirect: false }
        this.resetPass = this.resetPass.bind(this);
        // this.state = { userInfo: null };
    }

    resetPass() {
        const { email } = this.state;
        if (email != "") {
            var mailData = {
                email: email,
            }
            //Mail Gönderiliyor
            sendResetMail(mailData).then(function (res) {
                if (res.status == 200) {
                    alert(res.data.message)
                    if (res.data.state == 1) { this.setState({ redirect: true }); }
                }
                else { alert("Hata: " + res.status); }
            }.bind(this))
        }
        else {
            alert("Lütfen mail adresinizi girin")
        }
        //this.props.history.push("/");
    }

    render() {
        document.title = "Şifremi unuttum - I forgot my password";
        return (
            <div style={styles.bodyStyle}>
                {(this.state.redirect == true) ? <Redirect to={{ pathname: '/resetpass', state: { email: this.state.email } }} /> : ""}
                <h3>Şifremi unuttum - I forgot my password</h3>
                <InputGroup size="sm" style={{ marginTop: 10 }}>
                    <InputGroupAddon addonType="prepend">Email</InputGroupAddon>
                    <Input placeholder="Email" onChange={evt => this.setState({ email: evt.target.value })} />
                </InputGroup>
                <Button size="sm" color="success" style={styles.style} onClick={this.resetPass}>Şifremi Sıfırla / Reset My Password</Button>
            </div>
        );
    }
}

const styles = {
    style: {
        width: '100%',
        marginTop: 10,
    },
    bodyStyle: {
        margin: 'auto',
        width: '75%',
        borderRadius: 10,
        padding: '2%',
        marginTop: '5%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
}