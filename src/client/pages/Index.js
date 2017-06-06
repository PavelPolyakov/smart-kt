import * as React from "react";
import {autobind} from "core-decorators";

import {withRouter} from 'react-router'
import Test from '../components/Test';

import {app} from '../feathers';

@withRouter
@autobind
class IndexPage extends React.Component {
    render() {
        return (
            <section className="container">
                <Test></Test>
            </section>
        );
    }
}

export {IndexPage as default};
