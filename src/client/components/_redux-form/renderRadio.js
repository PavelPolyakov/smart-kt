import React from 'react';
import {FormGroup, Label, Input, FormFeedback, Col} from 'reactstrap';

const renderRadio = field => (
    <FormGroup tag="fieldset" color={field.meta.touched && field.meta.error ? 'danger' : ''}>
        <Label>{field.label}</Label>
        {field.options.map(record =>
            <FormGroup check key={record.value}>
                <Label check>
                    <Input
                        {...field.input}
                        value={record.value}
                        type="radio"
                        id={field.id}
                        checked={field.input.value === record.value}
                        state={field.meta.touched && field.meta.error ? 'danger' : ''}/>{' '}
                    {record.label}
                </Label>
            </FormGroup>)}
        {field.meta.touched &&
        field.meta.error &&
        <FormFeedback>{field.meta.error}</FormFeedback>}
    </FormGroup>
);

export default renderRadio;