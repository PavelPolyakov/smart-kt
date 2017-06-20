import React, {Component} from "react";
import {connect} from "react-redux";
import {autobind} from "core-decorators";
import {Container, Row, Col, Card, CardBlock, CardTitle, CardText, Badge, Button} from 'reactstrap';
import {app} from "../feathers";


@connect((state) => ({ user: state.user }))
@autobind
export default class Loan extends Component {

    async fund(amount) {
        console.log('FUNDING', amount);

        await app.service('fund').create({
            loan_id: this.props.loan._id,
            amount
        });
    }

    async repay(amount) {
        console.log('REPAY', amount);

        await app.service('repay').create({
            loan_id: this.props.loan._id,
            amount
        });
    }

    render() {
        const { loan } = this.props;
        return <Card>
            <CardBlock>
                <Row>
                    <Col>
                        <CardTitle>{loan._id}</CardTitle>
                        <CardText>Contract address: <code>{loan.address}</code></CardText>
                        <CardText>Wants to borrow: <code>{_.round(loan.milestones.FUNDING / 100, 2)} €</code></CardText>
                        <CardText>Will return: <code>{_.round(loan.milestones.PERFORMING / 100, 2)} €</code></CardText>
                        <CardText>Data: <code>{JSON.stringify(loan.data)}</code></CardText>
                    </Col>
                    <Col>
                        {loan.state.status === 'SEEDING' ? <Badge>SEEDING</Badge> : undefined}
                        {loan.state.status === 'FUNDING' ? <Badge color="info">FUNDING</Badge> : undefined}
                        {loan.state.status === 'PERFORMING' ? <Badge color="primary">PERFORMING</Badge> : undefined}
                        {loan.state.status === 'REPAID' ? <Badge color="success">REPAID</Badge> : undefined}

                        {loan.state.status === 'FUNDING' && this.props.user._id !== loan.user_id ?
                            <Row>
                                <Col>
                                    <hr/>
                                    <Button onClick={() => this.fund(1000)} color="success">Fund 10€</Button>{' '}
                                    <Button onClick={() => this.fund(5000)} color="success">Fund 50€</Button>{' '}
                                    <Button onClick={() => this.fund(10000)} color="success">Fund 100€</Button>{' '}
                                    <Button onClick={() => this.fund(25000)} color="success">Fund 250€</Button>{' '}
                                </Col>
                            </Row> : undefined }
                        {loan.state.status === 'PERFORMING' && this.props.user._id === loan.user_id ?
                            <Row>
                                <Col>
                                    <hr/>
                                    <Button onClick={() => this.repay(1000)} color="success">Repay 10€</Button>{' '}
                                    <Button onClick={() => this.repay(5000)} color="success">Repay 50€</Button>{' '}
                                    <Button onClick={() => this.repay(10000)} color="success">Repay 100€</Button>{' '}
                                    <Button onClick={() => this.repay(25000)} color="success">Repay 250€</Button>{' '}
                                </Col>
                            </Row> : undefined }
                        <br/>
                    </Col>
                </Row>
                {['FUNDING', 'REPAID'].includes(loan.state.status) ?
                    <Row>
                        <Col>
                            <hr/>
                            Funded{' '}<code>{_.round((loan.state.status !== 'REPAID' ? loan.state.balance : loan.milestones.FUNDING) / 100, 2)} €</code>
                            from{' '}
                            <code>{_.round(loan.milestones.FUNDING / 100, 2)} €</code>
                            {loan.funding.length ? <div>
                                <h3>Funding history:</h3>
                                <code>{JSON.stringify(loan.funding)}</code>
                            </div> : undefined }
                        </Col>
                    </Row> : undefined}
                {['PERFORMING', 'REPAID'].includes(loan.state.status) ?
                    <Row>
                        <Col>
                            <hr/>
                            Repaid{' '}
                            <code>{_.round((loan.state.status !== 'REPAID' ? loan.state.balance : loan.milestones.PERFORMING) / 100, 2)} €</code>
                            from{' '}
                            <code>{_.round(loan.milestones.PERFORMING / 100, 2)} €</code>
                            <br/>
                            {loan.repayment.length ? <div>
                                <h3>Repayment history:</h3>
                                <code>{JSON.stringify(loan.repayment)}</code>
                            </div> : undefined }
                        </Col>
                    </Row> : undefined}
            </CardBlock>
        </Card>
    }
}