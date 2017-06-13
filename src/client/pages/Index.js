import * as React from "react";
import {autobind} from "core-decorators";

import {withRouter} from 'react-router'
import Header from '../components/Header';
import LoansList from '../components/LoansList';

import {Row, Col} from 'reactstrap';

import {app} from '../feathers';

@withRouter
@autobind
class IndexPage extends React.Component {
    render() {
        return (
            <section className="container">
                <Header></Header>
                <Row>
                    <Col>
                        <LoansList/>
                    </Col>
                </Row>
            </section>
        );
    }
}

export {IndexPage as default};
