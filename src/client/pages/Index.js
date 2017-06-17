import * as React from "react";
import {autobind} from "core-decorators";

import {withRouter} from 'react-router'
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';

import {Row, Col} from 'reactstrap';

import {app} from '../feathers';

@withRouter
@autobind
class IndexPage extends React.Component {
    render() {
        return (
            <section className="container">
                <Header></Header>
                <Row style={{paddingTop: '3rem'}}>
                    <Col>
                        <Dashboard/>
                    </Col>
                </Row>
            </section>
        );
    }
}

export {IndexPage as default};
