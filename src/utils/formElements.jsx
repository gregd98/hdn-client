import produce from 'immer';
import React from 'react';
import {invitationConstraints as rules} from '../constraints/invitationConstraints';

const validate = require('validate.js');
const classNames = require('classnames');

export const FormRow = (input) => (
  <div className="form-row">
    {input.children}
  </div>
);

export const FormGroup = (input) => {
  const { children, size, na } = input;
  const classes = classNames({
    'form-group': true,
    [`col-md-${size}`]: size,
  });
  return (
    <div ref={na} className={classes}>
      {children}
    </div>
  );
};

export const TextInput = (input) => {
  const {
    contextual, id, label, inputKey, decorators, constraint,
  } = input;
  let { type } = input;
  const { inputs, setInputs, isLoading } = contextual;
  const { value, error } = inputs[inputKey];
  if (!type) {
    type = 'text';
  }
  const classes = classNames({
    'form-control': true,
    'is-invalid': error,
  });

  const handleChange = (e) => {
    setInputs(produce(inputs, (draft) => {
      draft[inputKey].error = '';
      draft[inputKey].value = e.target.value;
    }));
  };

  const handleBlur = () => {
    let tmp = value;
    if (decorators) {
      decorators.forEach((decorator) => {
        tmp = decorator(tmp);
      });
    }
    if (constraint) {
      const validation = validate({ value: tmp }, constraint,
        { fullMessages: false });
      const newError = validation ? validation.value[0] : '';
      if (tmp !== value || newError) {
        setInputs(produce(inputs, (draft) => {
          draft[inputKey].value = tmp;
          draft[inputKey].error = newError;
        }));
      }
    }
    console.log(inputs[inputKey].value);
  };

  return (
    <React.Fragment>
      <label htmlFor={id}>{label}</label>
      <input autoComplete="off" onChange={handleChange} onBlur={handleBlur} type={type} className={classes}
             id={id} placeholder={label} value={value} disabled={isLoading}/>
      {error && <div className="invalid-feedback">{error}</div>}
    </React.Fragment>
  );
};

export const SelectInput = (input) => {
  const {
    contextual, id, label, inputKey, constraint,
  } = input;
  const { inputs, setInputs, isLoading } = contextual;
  const { value, error } = inputs[inputKey];
  const classes = classNames({
    'custom-select': true,
    'is-invalid': error,
  });

  const handleChange = (e) => {
    const { selectedIndex } = e.target;
    const selected = e.target[selectedIndex].id;
    setInputs(produce(inputs, (draft) => {
      draft[inputKey].error = '';
      draft[inputKey].value = selected;
    }));
  };

  const handleBlur = () => {
    const validation = validate({ value }, constraint, { fullMessages: false });
    if (validation) {
      setInputs(produce(inputs, (draft) => {
        [draft[inputKey].error] = validation.value;
      }));
    }
  };

  return (
    <React.Fragment>
      <label htmlFor={id}>{label}</label>
      <select onChange={handleChange} onBlur={handleBlur}
              id={id} className={classes} disabled={isLoading}>
        <option value=""/>
        {inputs[inputKey].options.map((item) => <option key={item.id} id={item.id}>
          {item.name}
        </option>)}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </React.Fragment>
  );
};

export const Modal = (input) => {
  const {
    id, title, body, footer, isLoading, error,
  } = input;

  return (
    <div className="modal fade" id={id} data-backdrop="static" data-keyboard="false" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" disabled={isLoading}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {body}
          </div>
          <div className="modal-footer">
            {footer}
          </div>
          {error && <div className="alert alert-danger mx-2" role="alert">{error}</div>}
        </div>
      </div>
    </div>
  );
};
