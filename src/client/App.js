import * as React from "react";

import {Router, Route, Redirect} from "react-router";
import {autobind} from "core-decorators";

import {connect} from 'react-redux';
import _ from 'lodash';
import {app} from "./feathers";
import {paramsForServer} from 'feathers-hooks-common';

import Layout from "./layouts/Default";

import IndexPage from "./pages/Index";
import LoginPage from "./pages/Login";
import ApplyPage from "./pages/Apply";

import * as userActions from './store/actions/user';

@connect(state => ({ user: state.user }))
@autobind
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: undefined
        }
    }

    _setLoggedIn(value) {
        this.setState((prevState, props) => {
            const _state = _.cloneDeep(prevState);
            _state.loggedIn = value;
            return _state;
        });
    }

    async componentWillMount() {
        // try to authenticate in case feathers-jwt exists
        if (localStorage.getItem('feathers-jwt')) {
            try {
                const response = await app.authenticate();
                const payload = await app.passport.verifyJWT(response.accessToken)
                const userRecord = await app.service('users').get(payload.userId, paramsForServer({ frontEnd: true }));
                this.props.dispatch(userActions.set({
                    _id: userRecord._id,
                    username: userRecord.username,
                    wallet: { address: userRecord.wallet.address, balance: userRecord.wallet.balance }
                }));

                this._setLoggedIn(true);
            } catch (error) {
                this._setLoggedIn(false);
            }
        } else {
            this._setLoggedIn(false);
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.user) {
            this._setLoggedIn(true);
        }
    }

    render() {
        return (
            <Router history={this.props.history}>
                <Layout>
                    <Route path="/" exact
                           render={(props) => {
                               return (this.state.loggedIn === undefined || this.state.loggedIn) ?
                                   <IndexPage {...props}/> : <Redirect to="/login"/>
                           }}/>
                    <Route path="/apply" exact
                           render={(props) => {
                               return (this.state.loggedIn === undefined || this.state.loggedIn) ?
                                   <ApplyPage {...props}/> : <Redirect to="/login"/>
                           }}/>
                    <Route path="/login" exact
                           render={(props) => <LoginPage {...props}/>}/>
                </Layout>
            </Router>
        );
    }
}
export default App;
