import React from 'react';
import {FormGroup, Label, Input, FormFeedback, FormText} from 'reactstrap';

const renderField = field => (
    <FormGroup color={field.meta.touched && field.meta.error ? 'danger' : ''}>
        <Label>{field.label}</Label>
        <Input
            {...field.input}
            type={field.type}
            state={field.meta.touched && field.meta.error ? 'danger' : ''}
        />
        {field.meta.touched &&
        field.meta.error &&
        <FormFeedback>{field.meta.error}</FormFeedback>}
        {field.options &&
        field.options.text &&
        <FormText {...field.options.text.params}>{field.options.text.value}</FormText>}
    </FormGroup>
);

export default renderField;