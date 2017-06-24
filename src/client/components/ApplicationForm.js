import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from "react-redux";
import {reduxForm, Form, Field, isValid, getFormValues} from "redux-form";
import {withRouter} from "react-router";
import _ from 'lodash';
import {app} from "../feathers";
import {Row, Col, Button, Alert} from "reactstrap";

import renderCheckbox from "./_redux-form/renderCheckbox";
import renderField from "./_redux-form/renderField";
import renderRadio from "./_redux-form/renderRadio";
import {isRequired, isTrue} from "./_redux-form/validators";

@withRouter
@reduxForm({ form: "applicationForm" })
@connect((store, ownProps) => ({ user: store.user, values: getFormValues(ownProps.form)(store) || {} }))
@autobind
export default class ApplicationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applying: false
        }
    }

    componentWillMount() {
    }

    async onSubmit(values) {
        this.setState((prevState, props) => {
            const _state = _.cloneDeep(prevState);
            _state.applying = true;
            return _state;
        });

        const application = await app.service("applications").create(values);
        this.setState((prevState, props) => {
            const _state = _.cloneDeep(prevState);
            _state.applying = false;
            return _state;
        }, () => {
            this.props.history.push('/');
        });
    }

    render() {
        const { values, handleSubmit } = this.props;

        return (
            <div>
                <Form onSubmit={handleSubmit(this.onSubmit)}>
                    <div>
                        <Row>
                            <Col xs="2">
                        <Field
                            validate={[isRequired]}
                            name="amountApplied"
                            id="amountApplied"
                            label="I apply for:"
                            component={renderRadio}
                            options={[
                                { label: "100 €", value: "10000" },
                                { label: "250 €", value: "25000" },
                                { label: "500 €", value: "50000" }
                            ]}
                        />
                            </Col>
                            <Col xs="10">
                        {values.amountApplied ? <Alert color="info">
                            Interest rate is 30%.<br/>
                            In case you have a loan for <b>{_.round(values.amountApplied/100,2)} €</b> you'll repay <b>{_.round((values.amountApplied*1.3)/100,2)} €</b>
                        </Alert> : undefined}
                            </Col>
                        </Row>
                        <Field
                            validate={[isRequired]}
                            name="address"
                            id="address"
                            label="Address:"
                            component={renderField}
                        />
                        <Field
                            validate={[isRequired, isTrue]}
                            name="20kDataPoints"
                            id="creditBureau"
                            label="20.000 datapoints"
                            type="checkbox"
                            component={renderCheckbox}
                        />
                    </div>
                    <Button color="primary" disabled={!this.props.valid || this.state.applying ? true : false}
                            type="submit">
                        Apply{' '}
                        { this.state.applying ? <i class="fa fa-refresh fa-1x fa-spin"></i> : undefined }
                    </Button>
                </Form>
            </div>
        );
    }
}

//Hot Module Replacement API
if (module.hot) {
    module.hot.dispose(() => {
    });
}
