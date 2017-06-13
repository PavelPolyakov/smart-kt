import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from "react-redux";
import {app} from "../feathers";
import {Button, Row, Col} from 'reactstrap';
import {withRouter} from 'react-router';

@connect(store => {
    return {
        user: store.user || {
            username: undefined,
            wallet: {}
        }
    }
})
@withRouter
@autobind
export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Row>
                <Col>
                    Hello {this.props.user.username},
                    Address: {this.props.user.wallet.address}
                </Col>
                <Col>
                    <Button color="success" onClick={() => this.props.history.push('/apply')}>Apply for a loan</Button>
                </Col>
            </Row>
        );
    }
}