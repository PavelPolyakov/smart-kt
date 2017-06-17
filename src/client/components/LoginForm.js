import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from 'react-redux';
import {app} from "../feathers";
import {Button} from 'reactstrap';
import {Field, reduxForm} from 'redux-form';
import {paramsForServer} from 'feathers-hooks-common';
import _ from 'lodash';
import {withRouter} from 'react-router';
import renderField from "./_redux-form/renderField";
import { isRequired } from "./_redux-form/validators";

import * as userActions from '../store/actions/user';

@connect()
@withRouter
@reduxForm({ form: 'loginForm' })
@autobind
class LoginForm extends Component {
    constructor(props) {
        super(props);
    }

    async onSubmit(values) {
        let user;
        const lookupResult = await app.service('/users').find(paramsForServer({
            query: { username: values.username },
            lookup: true
        }));

        if (lookupResult && lookupResult.total) {
            user = _.first(lookupResult.data);
        } else {
            user = await app.service('/users').create({ username: values.username });
        }

        try {
            // trying to logout first
            await app.logout();
            const response = await app.authenticate({
                strategy: 'local',
                _id: user._id,
                password: user.username
            });
            const payload = await app.passport.verifyJWT(response.accessToken)
            // dispatch user to the store
            const userRecord = await app.service('users').get(payload.userId);
            this.props.dispatch(userActions.set({
                _id: userRecord._id,
                username: userRecord.username,
                wallet: { address: userRecord.wallet.address, balance: userRecord.wallet.balance }
            }));

            this.props.history.push('/');
        } catch (error) {
            console.error('Error authenticating!', error);
        }
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form>
                <div>
                    <Field
                        validate={[isRequired]}
                        name="username"
                        id="username"
                        label="Username:"
                        component={renderField}
                    />
                </div>
                <Button onClick={handleSubmit(this.onSubmit)}>Submit</Button>
            </form>
        );
    }
}

export default LoginForm;