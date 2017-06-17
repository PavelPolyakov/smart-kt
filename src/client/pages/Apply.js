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
    render() {
        return (
            <section className="container">
                <Header></Header>
                <Row style={{paddingTop: '3rem'}}>
                    <Col>
                        <ApplicationForm></ApplicationForm>
                    </Col>
                </Row>
            </section>
        );
    }
}

export {ApplyPage as default};
