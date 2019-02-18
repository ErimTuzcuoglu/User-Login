import React, { Component } from 'react';
import {
    DropdownItem,
    Button,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { register } from '../../controllers/nodeApiController';


export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = { email: "", isim: "", soyisim: "", pass: "", passConf: "", userId: '', userType: '', dropdownOpen: false }
        this.signUp = this.signUp.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    signUp() {
        const { email, isim, soyisim, pass, passConf, userType } = this.state;
        if (((isim && soyisim && pass && passConf && email && userType) != "") && ((pass.length > 5) && (passConf.length > 5))) {
            if (pass != passConf) alert("Parola ve Parola Doğrulaması Eşleşmiyor.")
            else {
                var data = {
                    name: isim,
                    surname: soyisim,
                    password: pass,
                    passwordConf: passConf,
                    email: email,
                    userType: userType
                }
                register(data).then(function (details) {
                    if (details.status == 200) {
                        this.setState({ userId: details.data.id });
                        alert(details.data.send)
                    }
                    else if (details.status == 400) { alert("Mail Adresi Daha Önceden Alınmış.") }
                    else { alert("Hata: " + details.status); }
                }.bind(this))
            }
        } else {
            alert("Lütfen Tüm Alanları Doğru Şekilde Doldurun")
        }
    }

    render() {
        document.title = "Kaydol - Signup";
        return (
            <div style={styles.bodyStyle}>
                <h3 style={{ margin: 'auto', width: 210 }}>Kaydol - Signup</h3>
                {(this.state.userId != "") ? <Redirect to={{ pathname: '/verify', state: { userId: this.state.userId } }} /> : ""}
                <AvForm style={styles.inputStyle}>
                    <AvGroup size="sm" className="input-group">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Isim / Name
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="name" placeholder="Name" type="text" onChange={evt => this.setState({ isim: evt.target.value })} />
                    </AvGroup>
                    <AvGroup size="sm" className="input-group">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Soyisim / Surname
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="surname" placeholder="Surname" type="text" onChange={evt => this.setState({ soyisim: evt.target.value })} />
                    </AvGroup>
                    <AvGroup size="sm" className="input-group">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Email
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="email" placeholder="Email" onChange={evt => this.setState({ email: evt.target.value })} type="text" validate={{ email: true }} />
                        <AvFeedback>Lütfen geçerli bir mail adresi yazın.</AvFeedback>
                    </AvGroup>
                    <AvGroup size="sm" className="input-group">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Parola / Password
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="password" placeholder="Password" type="password" onChange={evt => this.setState({ pass: evt.target.value })} validate={{ minLength: { value: 6 } }} />
                        <AvFeedback>Parola uzunluğu 6 haneden kısa olamaz.</AvFeedback>
                    </AvGroup>
                    <AvGroup size="sm" className="input-group">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={styles.indentSize}>
                                Parola / Password
                            </InputGroupText>
                        </InputGroupAddon>
                        <AvInput name="passwordCnf" placeholder="Confirm Password" type="password" onChange={evt => this.setState({ passConf: evt.target.value })} validate={{ minLength: { value: 6 } }} />
                        <AvFeedback>Parola uzunluğu 6 haneden kısa olamaz.</AvFeedback>
                    </AvGroup>
                </AvForm>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle style={styles.dropdownStyle}>
                        {this.state.userType != '' ? this.state.userType : "Kullanıcı Türü"}
                    </DropdownToggle>
                    <DropdownMenu style={{width:"100%", textAlign: 'center'}}>
                        <DropdownItem onClick={() => this.setState({ userType: "Admin" })}>Admin</DropdownItem>
                        <DropdownItem onClick={() => this.setState({ userType: "User" })}>User</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button size="sm" color="success" style={styles.style} onClick={this.signUp}>Kaydol - Sign Up</Button>
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
    inputStyle: {
        width: '100%',
        margin: 'auto',
        marginTop: 10
    },
    indentSize: {
        width: 160
    },
    dropdownStyle: {
        width: '100%',
        height: 40
    }
}