import React from 'react';
import {FormGroup, Label, Input, FormFeedback} from 'reactstrap';

const renderCheckbox = field => (
    <FormGroup color={field.meta.touched && field.meta.error ? 'danger' : ''}>
        <Label check>
            <Input
                {...field.input}
                type="checkbox"
                state={field.meta.touched && field.meta.error ? 'danger' : ''}
            />
            {' '}
            {field.label}
        </Label>
        {field.meta.touched &&
        field.meta.error &&
        <FormFeedback>{field.meta.error}</FormFeedback>}
    </FormGroup>
);

export default renderCheckbox;