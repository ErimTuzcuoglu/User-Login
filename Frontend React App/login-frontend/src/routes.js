import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import SignUp from './view/pages/SignUp';
import Admin from './view/pages/Admin';
import ForgotPass from './view/pages/ForgotPass';
import Verify from './view/pages/Verify';
import ResetPass from './view/pages/ResetPass';

const ReactRouter = () => {
    return (
        <Router>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/signup" component={SignUp} />
                <Route path="/admin" component={Admin} />
                <Route path="/verify" component={Verify} />
                <Route path="/forgotpass" component={ForgotPass} />
                <Route path="/resetpass" component={ResetPass} />
            </div>
        </Router>
    );
}


export default ReactRouter;