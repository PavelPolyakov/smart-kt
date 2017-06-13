import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from "react-redux";
import {app} from "../feathers";
import {Button} from 'reactstrap';

window.app = app;

@connect(store => ({}))
@autobind
export default class Test extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loans: []
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        const a = app.service('loans').on('created', (request) => {
            this.setState((prevState, props) => {
                prevState.loans.push(request);
                return prevState;
            });
        });
    }

    newLoan() {
        app.service('loans').create({ 'hello': 'hello' });
    }

    render() {
        return (
            <div>
                <div>loans: {JSON.stringify(this.state.loans.length)}</div>
                <ul>
                    {_.map(this.state.loans, (loan, index) => {
                        return <li key={index}>{JSON.stringify(loan)}</li>
                    })}
                </ul>
            </div>
        );
    }
}

//Hot Module Replacement API
if (module.hot) {
    module.hot.dispose(() => {
        app.service('loans').removeAllListeners('created');
    });
}