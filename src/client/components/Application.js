import React, {Component} from "react";
import {connect} from "react-redux";
import {Row, Col, Card, CardBlock, CardTitle, CardText, Badge} from 'reactstrap';
import EuroLoader from './EuroLoader';
import _ from 'lodash';

@connect((store) => ({}))
export default class Application extends Component {
    render() {
        const { application } = this.props;
        return <Card>
            <CardBlock>
                <Row>
                    <Col>
                        <CardTitle>{application._id}</CardTitle>
                        <CardText>Amount applied: <code>{_.round(application.amountApplied / 100, 2)} €</code></CardText>
                        <CardText>Address: <code>{application.address}</code></CardText>
                    </Col>
                    <Col>
                        {application.status === 'SUBMITTED' ? <Badge color="info">SUBMITTED</Badge> : undefined}
                        {application.status === 'SCORING' ? <EuroLoader/> : undefined}
                        {application.status === 'ACCEPTED' ? <Badge color="success">ACCEPTED</Badge> : undefined}
                        {application.status === 'REJECTED' ? <Badge color="error">REJECTED</Badge> : undefined}
                    </Col>
                </Row>
            </CardBlock>
        </Card>
    }
}