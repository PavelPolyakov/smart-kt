import React, {Component} from "react";
import {connect} from "react-redux";
import {autobind} from "core-decorators";
import {Row, Col, Card, CardBlock, CardTitle, CardText, Badge, Button} from 'reactstrap';
import {app} from "../feathers";


@connect((store) => ({ user: store.user }))
@autobind
export default class Loan extends Component {

    async fund(amount) {
        console.log('FUNDING', amount);

        await app.service('fund').create({
            loan_id: this.props.loan._id,
            amount
        })
    }

    render() {
        const { loan } = this.props;
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

                        <br/>
                        <code>{JSON.stringify(loan.funding)}</code>
                    </Col>
                </Row>
                {loan.status === 'FUNDING' && this.props.user._id !== loan.user_id ?
                    <Row style={{paddingTop: '2rem'}}>
                        <Col>
                            <Button onClick={() => this.fund(5000)} color="success">Fund 50€</Button>
                        </Col>
                    </Row> : undefined}
            </CardBlock>
        </Card>
    }
}