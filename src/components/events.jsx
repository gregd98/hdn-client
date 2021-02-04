import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import produce from 'immer';
import {restGet, restPut} from '../utils/communication';
import * as Constants from '../constants';
import { loadEvents } from '../actions/systemActions';
import ErrorPage from './error_page.jsx';
import LoadingPage from './loading_page.jsx';
import {
  FormGroup, FormRow, Modal, TextInput,
} from '../utils/formElements.jsx';
import { eventConstraints as rules } from '../constraints/eventConstraints';

const validate = require('validate.js');

const inputDefaults = {
  name: { value: '', error: '' },
  startDate: { value: '', error: '' },
  endDate: { value: '', error: '' },
};

const Events = () => {
  const events = useSelector((state) => state.system.events);
  const [inputs, setInputs] = useState(inputDefaults);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const [pageError, setPageError] = useState({});
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    const removeModal = () => {
      window.$('#addEventModal').modal('hide');
      window.$('body').removeClass('modal-open');
      window.$('.modal-backdrop').remove();
    };
    window.onpopstate = removeModal;
    return () => {
      removeModal();
      window.onpopstate = () => {};
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    restGet(`${Constants.SERVER_PATH}api/events`, dispatch, removeCookie).then((result) => {
      dispatch(loadEvents(result));
      setLoading(false);
    }).catch((error) => {
      setPageError(error);
      setLoading(false);
    });
  }, [dispatch, removeCookie]);

  const trimDecorator = (value) => value.trim();

  const addEvent = () => {
    setDialogError('');
    const validationObj = {};
    Object.keys(rules).forEach((rule) => {
      validationObj[rule] = inputs[rule].value;
    });

    const validation = validate(validationObj, rules, { fullMessages: false });
    if (validation) {
      setInputs(produce(inputs, (draft) => {
        Object.entries(validation).forEach(([key, value]) => {
          [draft[key].error] = value;
        });
      }));
    } else {
      setDialogLoading(true);
      restPut(`${Constants.SERVER_PATH}api/events`, validationObj, dispatch, removeCookie).then(() => {
        window.$('#addEventModal').modal('hide');
        setDialogLoading(false);
        restGet(`${Constants.SERVER_PATH}api/events`, dispatch, removeCookie).then((result) => {
          dispatch(loadEvents(result));
        }).catch((error) => {
          setPageError(error);
        });
      }).catch((error) => {
        setDialogLoading(false);
        if (error.inputErrors) {
          setDialogError('');
          setInputs(produce(inputs, (draft) => {
            Object.entries(error.inputErrors).forEach(([key, value]) => {
              draft[key].error = value;
            });
          }));
        } else {
          setDialogError(error.message);
        }
      });
    }
  };

  const renderAddEventModal = () => {
    const contextual = { inputs, setInputs, isLoading: dialogLoading };

    const modalBody = (
      <React.Fragment>
        <FormRow>
          <FormGroup size="12">
            <TextInput
              contextual={contextual}
              id="inputName"
              label="Name"
              inputKey="name"
              constraint={{ value: rules.name }}
              decorators={[trimDecorator]}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup size="6">
            <TextInput
              contextual={contextual}
              id="inputStartDate"
              label="Start date"
              type="date"
              inputKey="startDate"
              constraint={{ value: rules.name }}
            />
          </FormGroup>
          <FormGroup size="6">
            <TextInput
              contextual={contextual}
              id="inputEndDate"
              label="End date"
              type="date"
              inputKey="endDate"
              constraint={{ value: rules.name }}
            />
          </FormGroup>
        </FormRow>
      </React.Fragment>
    );

    const modalFooter = (
      <React.Fragment>
        <button type="button" className="btn btn-secondary" data-dismiss="modal" disabled={dialogLoading}>Close</button>
        <button onClick={addEvent} type="button" className="btn btn-primary" disabled={dialogLoading}>
          {dialogLoading
          && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
          Add event
        </button>
      </React.Fragment>
    );

    return <Modal id="addEventModal" title="Add event" body={modalBody} footer={modalFooter} isLoading={dialogLoading} error={dialogError}/>;
  };

  if (pageError.message) {
    return <ErrorPage status={pageError.status} message={pageError.message} />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center mt-4 mx-2">
        <div style={{ width: 500 }}>
          <h1 className="text-center display-4">Events</h1>
          <div className="d-flex justify-content-center mt-4">
            <button onClick={() => {
              setInputs(inputDefaults);
            }} className="btn btn-outline-primary ml-2" data-toggle="modal" data-target="#addEventModal">Add event</button>
          </div>
        </div>
      </div>
      <div className="table-responsive mt-4">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Start date</th>
              <th className="text-center">End date</th>
            </tr>
          </thead>
          <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="text-center">{event.name}</td>
              <td className="text-center">{event.firstDay}</td>
              <td className="text-center">{event.lastDay}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      {renderAddEventModal()}
    </React.Fragment>
  );
};

export default Events;
