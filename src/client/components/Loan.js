import React, {Component} from "react";
import {connect} from "react-redux";
import {Row, Col, Card, CardBlock, CardTitle, CardText, Badge} from 'reactstrap';

@connect((store) => ({}))
export default class Loan extends Component {

    render() {
        const {loan} = this.props;
        return <Card>
            <CardBlock>
                <Row>
                    <Col>
                        <CardTitle>{loan._id}</CardTitle>
                        <CardText>Contract address: <code>{loan.address}</code></CardText>
                        <CardText>Wants to borrow: <code>{_.round(loan.FUNDING / 100, 2)} €</code></CardText>
                        <CardText>Will return: <code>{_.round(loan.PERFORMING / 100, 2)} €</code></CardText>
                        <CardText>Data: <code>{JSON.stringify(loan.data)}</code></CardText>
                    </Col>
                    <Col>
                        {loan.status === 'SEEDING' ? <Badge>SEEDING</Badge> : undefined}
                        {loan.status === 'FUNDING' ? <Badge color="info">FUNDING</Badge> : undefined}
                        {loan.status === 'PERFORMING' ? <Badge color="primary">PERFORMING</Badge> : undefined}
                        {loan.status === 'SETTLED' ? <Badge color="success">ACCEPTED</Badge> : undefined}
                    </Col>
                </Row>
            </CardBlock>
        </Card>
    }
}