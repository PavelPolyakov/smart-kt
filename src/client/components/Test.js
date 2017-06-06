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
            requests: []
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        const a = app.service('/requests').on('created', (request) => {
            this.setState((prevState, props) => {
                prevState.requests.push(request);
                return prevState;
            });
        });
    }

    newRequest() {
        app.service('/requests').create({ 'hello': 'hello' });
    }

    render() {
        return (
            <div>
                <div>requests: {JSON.stringify(this.state.requests.length)}</div>
                <ul>
                    {_.map(this.state.requests, (request, index) => {
                        return <li key={index}>{JSON.stringify(request)}</li>
                    })}
                </ul>

                <Button onClick={this.newRequest}>new request</Button>
            </div>
        );
    }
}

//Hot Module Replacement API
if (module.hot) {
    module.hot.dispose(() => {
        app.service('/requests').removeAllListeners('created');
    });
}