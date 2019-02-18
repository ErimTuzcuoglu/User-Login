import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import {
    Input,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { login } from '../../controllers/nodeApiController';


export default class LoginBox extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "", pass: "", redirectToVerifyPage: false, userId: "" }
        this.loginFunc = this.loginFunc.bind(this);
        // this.state = { userInfo: null };
    }

    loginFunc() {
        const { email, pass } = this.state;
        if ((pass && email) != "" && pass.length > 5) {
            var data = {
                password: pass,
                email: email
            }
            var status = login(data).then(function (details) {
                if (details.status == 200 && details.data.state != 1) {
                    alert("Başarıyla Giriş Yaptınız.")
                    localStorage.setItem("userData", JSON.stringify(details.data))
                    window.location.reload(false);

                    //this.props.history.push("/");
                } else if (details.status == 200 && details.data.state == 1) {
                    alert(details.data.message);
                    this.setState({ redirectToVerifyPage: true, userId: details.data.userId });
                } else if (details.status == 400) {
                    alert(details.data.message);
                }
                else {
                    alert("Hata: " + details.status);
                }
            }.bind(this))
        } else {
            alert("Lütfen Tüm Alanları Doğru Şekilde Doldurun")
        }
    }

    render() {
        return (
            <div>
                {(this.state.redirectToVerifyPage == true) ? <Redirect to={{ pathname: '/verify', state: { userId: this.state.userId } }} /> : ""}
                <h3>Giriş Yap</h3>
                <div style={{ marginTop: 100 }}>
                    <AvForm style={style.inputStyle}>
                        <AvGroup size="sm" className="input-group">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={style.indentSize}>
                                    Email
                            </InputGroupText>
                            </InputGroupAddon>
                            <AvInput name="email" placeholder="Email" onChange={evt => this.setState({ email: evt.target.value })} type="text" validate={{ email: true }} />
                            <AvFeedback>Lütfen geçerli bir mail adresi yazın.</AvFeedback>
                            {/* <Input placeholder="Email" onChange={evt => this.setState({ email: evt.target.value })} /> */}
                        </AvGroup>

                        <AvGroup size="sm" className="input-group">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={style.indentSize}>
                                    Password / Parola
                            </InputGroupText>
                            </InputGroupAddon>
                            <AvInput name="password" placeholder="Password" type="password" onChange={evt => this.setState({ pass: evt.target.value })} validate={{ minLength: { value: 6 } }} />
                            <AvFeedback>Parola uzunluğu 6 haneden kısa olamaz.</AvFeedback>
                        </AvGroup>
                        {/* <Input placeholder="Password" type="password" onChange={evt => this.setState({ pass: evt.target.value })} /> */}
                    </AvForm>
                </div>
                <Button size="sm" color="success" style={style.inputStyle} onClick={this.loginFunc}>Giriş Yap / Login</Button>
            </div>
        );
    }
}
const style = {
    inputStyle: {
        width: '50%',
        margin: 'auto',
        marginTop: 10
    },
    indentSize: {
        width: 160
    }
}
