import React, { Component } from 'react';
import {
    Button,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { resetPassword, updateUser } from '../../controllers/nodeApiController';

export default class ResetPass extends Component {

    constructor(props) {
        super(props);
        this.state = { code: "", newPass: "", newPassConf: '', redirect: false }
        this.passwordUpdate = this.passwordUpdate.bind(this);
        // this.state = { userInfo: null };
    }

    passwordUpdate() {
        const { code, newPass, newPassConf } = this.state;
        if (((code && newPass && newPassConf) != "") && (newPass == newPassConf) && ((newPass.length > 5) && (newPassConf.length > 5))) {
            resetPassword({ email: this.props.location.state.email, code: code, newPassword: newPass }).then(function (res) {
                if (res.status == 200) {
                    alert(res.data.message)
                    if (res.data.state == 1) { return this.setState({ redirect: true }) }
                } else {
                    alert("Hata: " + res.status)
                }
            }.bind(this))
        } else {
            alert("Yeni parola alanları birbiriyle uyuşmuyor.Ya da alanlar boş.")
        }
        //this.props.history.push("/");
    }

    render() {
        document.title = "Şifremi unuttum - I forgot my password";
        return (
            <div style={styles.bodyStyle}>
                {((this.state.redirect == true) || (this.props.location.state == (undefined || null))) ? <Redirect to={{ pathname: '/' }} /> : ""}
                <h3>Şifremi unuttum - I forgot my password</h3>

                <AvForm>
                    <AvGroup size="sm" className="input-group" style={{ marginTop: 10 }}>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Doğrulama Kodu - Code
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="code" placeholder="Code" type="text" onChange={evt => this.setState({ code: evt.target.value })} />
                    </AvGroup>
                    <AvGroup size="sm" className="input-group">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Yeni Parola - New Password
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="password" placeholder="New Password" type="password" onChange={evt => this.setState({ newPass: evt.target.value })} validate={{ minLength: { value: 6 } }} />
                        <AvFeedback>Parola uzunluğu 6 haneden kısa olamaz.</AvFeedback>
                    </AvGroup>
                    <AvGroup size="sm" className="input-group">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Yeni Parola (Tekrar) - New Password (Again)
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="passwordCnf" placeholder="New Password" type="password" onChange={evt => this.setState({ newPassConf: evt.target.value })} validate={{ minLength: { value: 6 } }} />
                        <AvFeedback>Parola uzunluğu 6 haneden kısa olamaz.</AvFeedback>
                    </AvGroup>
                </AvForm>
                <Button size="sm" color="success" style={styles.style} onClick={this.passwordUpdate}>Şifremi Güncelle - Update My Password</Button>
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