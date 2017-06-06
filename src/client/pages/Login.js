import * as React from "react";
import {autobind} from "core-decorators";

import {withRouter} from 'react-router'
import LoginForm from '../components/LoginForm';

import {app} from '../feathers';

@withRouter
@autobind
class LoginPage extends React.Component {
    render() {
        return (
            <section className="container">
                <LoginForm/>
            </section>
        );
    }
}

export {LoginPage as default};
