import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from "react-redux";
import {app} from "../feathers";
import {Button, Row, Col} from 'reactstrap';
import {withRouter} from 'react-router';
import { Link } from 'react-router-dom'
import _ from 'lodash';

import * as userActions from '../store/actions/user';

@connect(store => {
    return {
        user: store.user
    }
})
@withRouter
@autobind
export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        app.service("users").on("patched", (user) => {
            this.props.dispatch(userActions.updateBalance(user.wallet.balance));
        });
    }

    componentWillUnmount() {
        app.service('users').removeAllListeners('patched');
    }

    async logout() {
        await app.logout();
        this.props.history.push('/login');
    }

    render() {
        return (
            <Row>
                <Col>
                    Hello {this.props.user.username} (<a href="" style={{ cursor: 'pointer' }} onClick={this.logout}>logout</a>),<br/>
                    <div>Address: <code>{this.props.user.wallet.address}</code></div>
                    <div>Balance: <code>{this.props.user.wallet.balance.ETH} WEI</code>,
                        <code>{_.round(this.props.user.wallet.balance.EUR / 100, 2)} €</code></div>
                </Col>
                <Col>
                    { this.props.location.pathname === '/apply' ?
                        <Link to="/">&larr; Dashboard</Link> :
                        <Button color="success" style={{ cursor: 'pointer' }}
                                onClick={() => this.props.history.push('/apply')}>Apply for a loan</Button> }
                </Col>
            </Row>
        );
    }
}

//Hot Module Replacement API
if (module.hot) {
    module.hot.dispose(() => {
        app.service('users').removeAllListeners();
    });
}