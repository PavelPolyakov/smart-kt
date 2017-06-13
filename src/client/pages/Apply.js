import * as React from "react";
import {autobind} from "core-decorators";

import {withRouter} from 'react-router'
import Header from '../components/Header';
import ApplicationForm from '../components/ApplicationForm';
import {Row, Col, Button} from 'reactstrap';

import {app} from '../feathers';

@withRouter
@autobind
class ApplyPage extends React.Component {
    newLoan() {
        app.service('loans').create({ 'hello': 'hello' });
    }

    render() {
        return (
            <section className="container">
                <Header></Header>
                <Row>
                    <Col>
                        <ApplicationForm></ApplicationForm>

                        <Button onClick={this.newLoan}>new loan</Button>
                    </Col>
                </Row>
            </section>
        );
    }
}

export {ApplyPage as default};
