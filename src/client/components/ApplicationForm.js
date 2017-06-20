import React, {Component} from "react";
import {autobind} from "core-decorators";
import {connect} from "react-redux";
import {reduxForm, Form, Field, isValid} from "redux-form";
import {withRouter} from "react-router";
import {app} from "../feathers";
import {Button} from "reactstrap";

import renderCheckbox from "./_redux-form/renderCheckbox";
import renderField from "./_redux-form/renderField";
import renderRadio from "./_redux-form/renderRadio";
import {isRequired, isTrue} from "./_redux-form/validators";

@connect((state, ownProps) => ({ user: state.user }))
@withRouter
@reduxForm({ form: "applicationForm" })
@autobind
export default class Test extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    async onSubmit(values) {
        const application = await app.service("applications").create(values);
        this.props.history.push('/');
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <Form onSubmit={handleSubmit(this.onSubmit)}>
                    <div>
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
                    <Button color="primary" disabled={!this.props.valid ? true : false} type="submit">Apply</Button>
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
