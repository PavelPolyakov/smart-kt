import * as React from "react";

import {Router, Route} from "react-router";
import {autobind} from "core-decorators";

import {connect} from 'react-redux';

import Layout from "./layouts/Default";

import IndexPage from "./pages/Index";
import LoginPage from "./pages/Login";

import * as userActions from './store/actions/user';

@connect()
@autobind
class App extends React.Component {
    async componentWillMount() {
        try {
            const response = await app.authenticate();
            const payload = await app.passport.verifyJWT(response.accessToken)
            const user = await app.service('users').get(payload.userId);
            this.props.dispatch(userActions.set(user));
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Router history={this.props.history}>
                <Layout>
                    <Route path="/" exact
                           render={(props) => <IndexPage {...props}/>}/>
                    <Route path="/login" exact
                           render={(props) => <LoginPage {...props}/>}/>
                </Layout>
            </Router>
        );
    }
}
export default App;
