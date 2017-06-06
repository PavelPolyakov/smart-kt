import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from 'react-redux';
import {app} from "../feathers";
import {Button} from 'reactstrap';
import {Field, reduxForm} from 'redux-form';

import * as userActions from '../store/actions/user';

@connect()
@reduxForm({ form: 'loginForm' })
@autobind
class LoginForm extends Component {
    constructor(props) {
        super(props);
    }

    async onSubmit(values) {
        const result = await app.service('/users').create({ username: values.username });

        try {
            // trying to logout first
            await app.logout();
            const response = await app.authenticate({
                strategy: 'local',
                _id: result._id,
                password: result.username
            });
            const payload = await app.passport.verifyJWT(response.accessToken)
            const user = await app.service('users').get(payload.userId);
            this.props.dispatch(userActions.set(user));
        } catch (error) {
            console.error('Error authenticating!', error);
        }
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <Field name="username" component="input" type="text"/>
                </div>
                <Button onClick={handleSubmit(this.onSubmit)}>Submit</Button>
            </form>
        );
    }
}

export default LoginForm;