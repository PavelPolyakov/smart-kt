import * as React from "react";

import {Router, Route, Redirect} from "react-router";
import {autobind} from "core-decorators";

import {connect} from 'react-redux';

import {app} from "./feathers";

import Layout from "./layouts/Default";

import IndexPage from "./pages/Index";
import LoginPage from "./pages/Login";
import ApplyPage from "./pages/Apply";

import {withRouter} from 'react-router';

import * as userActions from './store/actions/user';

@connect()
@autobind
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: undefined
        }
    }

    async componentWillMount() {
        // try to authenticate in case feathers-jwt exists
        if(localStorage.getItem('feathers-jwt')) {
            try {
                const response = await app.authenticate();
                const payload = await app.passport.verifyJWT(response.accessToken)
                const userRecord = await app.service('users').get(payload.userId);
                this.props.dispatch(userActions.set({
                    _id: userRecord._id,
                    username: userRecord.username,
                    wallet: { address: userRecord.wallet.address, balance: userRecord.wallet.balance }
                }));

                this.setState((prevState, props) => {
                    prevState.loggedIn = true;
                    return prevState;
                });
            } catch (error) {
                this.setState((prevState, props) => {
                    prevState.loggedIn = false;
                    return prevState;
                });
            }
        } else {
            this.setState((prevState, props) => {
                prevState.loggedIn = false;
                return prevState;
            });
        }
    }

    render() {
        return (
            <Router history={this.props.history}>
                <Layout>
                    { this.props.history.location.pathname === '/' && this.state.loggedIn === false  ? <Redirect to="/login" /> : undefined }
                    <Route path="/" exact
                           render={(props) => <IndexPage {...props}/>}/>
                    <Route path="/apply" exact
                           render={(props) => <ApplyPage {...props}/>}/>
                    <Route path="/login" exact
                           render={(props) => <LoginPage {...props}/>}/>
                </Layout>
            </Router>
        );
    }
}
export default App;
