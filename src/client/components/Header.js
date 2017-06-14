import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from "react-redux";
import {app} from "../feathers";
import {Button, Row, Col} from 'reactstrap';
import {withRouter} from 'react-router';
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
            console.log('dispatching!', user.wallet.balance);
            this.props.dispatch(userActions.updateBalance(user.wallet.balance));
        });
    }

    render() {
        return (
            <Row>
                <Col>
                    Hello {this.props.user.username},<br/>
                    <div>Address: {this.props.user.wallet.address}</div>
                    <div>Balance: {this.props.user.wallet.balance.ETH} WEI, {_.round(this.props.user.wallet.balance.EUR / 100, 2)} €</div>
                </Col>
                <Col>
                    <Button color="success" onClick={() => this.props.history.push('/apply')}>Apply for a loan</Button>
                </Col>
            </Row>
        );
    }
}