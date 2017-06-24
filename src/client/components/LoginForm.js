import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from 'react-redux';
import {app} from "../feathers";
import {Button} from 'reactstrap';
import {Form, Field, reduxForm} from 'redux-form';
import {paramsForServer} from 'feathers-hooks-common';
import _ from 'lodash';
import {withRouter} from 'react-router';
import renderField from "./_redux-form/renderField";
import {isRequired} from "./_redux-form/validators";

import * as userActions from '../store/actions/user';

@connect()
@withRouter
@reduxForm({ form: 'loginForm' })
@autobind
class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggingIn: false
        }
    }

    async onSubmit(values) {
        // trim
        values.username = _.trim(values.username);

        this.setState((prevState, props) => {
            const _state = _.cloneDeep(prevState);
            _state.loggingIn = true;
            return _state;
        });

        let user;
        const lookupResult = await app.service('users').find(paramsForServer({
            query: { username: values.username },
            lookup: true
        }));

        if (lookupResult && lookupResult.total) {
            user = _.first(lookupResult.data);
        } else {
            user = await app.service('users').create({ username: values.username });
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
            const userRecord = await app.service('users').get(payload.userId, paramsForServer({ frontEnd: true }));
            this.props.dispatch(userActions.set({
                _id: userRecord._id,
                username: userRecord.username,
                wallet: { address: userRecord.wallet.address, balance: userRecord.wallet.balance }
            }));

            this.setState((prevState, props) => {
                const _state = _.cloneDeep(prevState);
                _state.loggingIn = false;
                return _state;
            }, () => {
                this.props.history.push('/');
            });
        } catch (error) {
            console.error('Error authenticating!', error);
            this.setState((prevState, props) => {
                const _state = _.cloneDeep(prevState);
                _state.loggingIn = false;
                return _state;
            });
        }
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <div>
                    <Field
                        validate={[isRequired]}
                        name="username"
                        id="username"
                        label="Username:"
                        component={renderField}
                    />
                </div>
                <Button type="submit" disabled={this.state.loggingIn}>
                    Submit{' '}
                    { this.state.loggingIn ? <i class="fa fa-refresh fa-1x fa-spin"></i> : undefined }
                </Button>
            </Form>
        );
    }
}

export default LoginForm;