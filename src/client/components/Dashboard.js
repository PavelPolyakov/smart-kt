import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from "react-redux";
import {app} from "../feathers";
import {Button, Alert} from 'reactstrap';
import Loan from './Loan';
import Application from './Application';
import _ from 'lodash';

@connect(state => ({}))
@autobind
export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applications: [],
            loans: []
        };
    }

    async componentWillMount() {
        const applications = await app.service('applications').find();
        const loans = await app.service('loans').find();

        this.setState((prevState, props) => {
            const _state = _.cloneDeep(prevState);
            _state.applications = applications.data;
            _state.loans = loans.data;

            return _state;
        });
    }

    componentDidMount() {
        // applications
        app.service('applications').on('created', (application) => {
            this.setState((prevState, props) => {
                const _state = _.cloneDeep(prevState);
                _state.applications.push(application);
                return _state;
            });
        });

        app.service('applications').on('patched', (application) => {
            this.setState((prevState, props) => {
                const _state = _.cloneDeep(prevState);
                const record = _.find(_state.applications, (record) => record._id === application._id);
                _.merge(record, application);

                return _state;
            });
        });

        app.service('applications').on('removed', (application) => {
            this.setState((prevState, props) => {
                const _state = _.cloneDeep(prevState);
                _.remove(_state.applications, (record) => record._id === application._id);

                return _state;
            });
        });

        // loans
        app.service('loans').on('created', (loan) => {
            this.setState((prevState, props) => {
                const _state = _.cloneDeep(prevState);
                _state.loans.push(loan);
                return _state;
            });
        });

        app.service('loans').on('patched', (loan) => {
            this.setState((prevState, props) => {
                const _state = _.cloneDeep(prevState);
                const record = _.find(_state.loans, (record) => record._id === loan._id);
                _.merge(record, loan);

                return _state;
            });
        });
    }

    componentWillUnmount() {
        app.service('loans').removeAllListeners('created');
        app.service('loans').removeAllListeners('patched');
        app.service('loans').removeAllListeners('removed');
        app.service('applications').removeAllListeners('created');
        app.service('applications').removeAllListeners('patched');
        app.service('applications').removeAllListeners('removed');
    }

    render() {
        // in case there are no applications or loans yet
        if (this.state.loans.length === 0 && this.state.applications.length === 0) {
            return (<Alert color="info">
                <strong>No activity so far :(</strong>
            </Alert>)
        }

        return (
            <div>
                {this.state.applications.length ? <div>
                    <h2>Applications:</h2>
                    {_.map(this.state.applications, (application, index) => {
                        return <div key={index}><Application application={application}/><br/></div>
                    })}
                </div> : undefined }
                {this.state.loans.length ? <div>
                    <h2>Loans:</h2>
                    {_.map(this.state.loans, (loan, index) => {
                        return <div key={index}><Loan loan={loan}/><br/></div>
                    })}
                </div> : undefined }
            </div>
        );
    }
}

//Hot Module Replacement API
if (module.hot) {
    module.hot.dispose(() => {
        app.service('loans').removeAllListeners();
        app.service('applications').removeAllListeners();
    });
}