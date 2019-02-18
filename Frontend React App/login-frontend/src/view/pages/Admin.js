import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Input, InputGroupAddon, InputGroup, InputGroupText } from 'reactstrap';
import { getAdminData } from '../../controllers/nodeApiController';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = { todayRegistered: 0, notVerified: 0, online: 0, average: 0 }
        this.adminData = this.adminData.bind(this);
        this.adminData();
    }

    adminData() {
        getAdminData().then(function (res) {
            console.log(res.data)
            this.setState({ 
                todayRegistered: res.data.registered.length,
                notVerified : res.data.notVerified.length,
                online: res.data.onlineUsers.length,
                average: res.data.userLoginAverage || 0
             })
        }.bind(this))
    }

    render() {
        document.title = "Admin Sayfası - Admin Page";
        var userInfo = JSON.parse(localStorage.getItem("userData"))
        return (
            <div style={style.mainDivStyle}>
                {((userInfo == null || undefined || '') || (userInfo.userType != 'Admin')) ? <Redirect to={{pathname: "/"}} /> : ""}
                <h3 align="center">Admin Sayfası</h3>
                <h5>Bugün kaydolmuş ve hesabını onaylamış kişi sayısı: {this.state.todayRegistered}</h5>
                <h5>Online kişi sayısı: {this.state.online}</h5>
                <h5>Aktivasyon maili alıp 1 gün yada daha fazla geçtiği halde kaydolmayan kişi sayısı: {this.state.notVerified}</h5>
                <h5>Ortalama aktivasyon süresi (Bugün kaydolan kullanıcılar için): {this.state.average.toFixed(3)} Saniye</h5>
                <br /><br />
            </div>
        );
    }
}
const style = {
    mainDivStyle: {
        margin: '10%',
        marginTop: '5%',
    },
}

export default Admin;
