import React, { Component } from 'react';
import {
    Input,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import { updateUser, getUser } from '../../controllers/nodeApiController';


export default class Verify extends Component {

    constructor(props) {
        super(props);
        this.state = { code: "", redirect: false, isOn: false, time: 0, start: 0 }
        this.verify = this.verify.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    verify() {
        if (this.state.code != "") {
            getUser(this.props.location.state.userId).then(function (res) {
                if (this.state.code.trim() == res.data.verificationCode.trim()) {
                    var userNewData = { activateState: true, activationTime: this.state.time / 1000 }
                    return updateUser(this.props.location.state.userId, userNewData).then(function (res) {
                        if (res.status == 200) {
                            alert("Başarıyla onaylandı")
                            return this.setState({ redirect: true })
                        } else {
                            alert("Hata: " + res.status)
                        }
                    }.bind(this))
                } else {
                    alert("Yanlış kod girdiniz.")
                }

            }.bind(this));
        } else { alert("Lütfen kodu giriniz.") }

    }
    startTimer() {
        this.setState({
            isOn: true,
            time: this.state.time,
            start: Date.now() - this.state.time
        })
        this.timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start
        }), 1);
    }
    stopTimer() {
        this.setState({ isOn: false })
        clearInterval(this.timer)
    }

    render() {
        document.title = "Doğrula - Verify";
        return (
            <div style={styles.bodyStyle}>
                {((this.state.redirect == true) || (this.props.location.state == (undefined || null))) ? <Redirect to={{ pathname: '/' }} /> : ""}
                {this.state.isOn == false ? this.startTimer() : ""}
                <h3 style={{ margin: 'auto', width: 210 }}>Doğrula / Verify</h3>
                <p>Kaydolurken kullandığınız mail adresinize gönderilen kodu yazın.</p>
                <InputGroup size="sm" style={styles.style}>
                    <InputGroupAddon addonType="prepend">
                        Doğrulama Kodu - Verification Code
                    </InputGroupAddon>
                    <Input placeholder="Code" onChange={evt => this.setState({ code: evt.target.value })} />
                </InputGroup>
                <Button size="sm" color="success" style={styles.style} onClick={this.verify}>Kaydı Tamamla</Button>
            </div>
        );
    }
}

const styles = {
    style: {
        width: '100%',
        margin: 'auto',
        marginTop: 10
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