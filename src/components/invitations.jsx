import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import produce from 'immer';
import { restGet, restPut } from '../utils/communication';
import * as Constants from '../constants';
import { loadInvitations } from '../actions/systemActions';
import { invitationConstraints as rules } from '../constraints/invitationConstraints';
import ErrorPage from './error_page.jsx';
import LoadingPage from './loading_page.jsx';
import {
  TextInput, SelectInput, FormRow, FormGroup, Modal,
} from '../utils/formElements.jsx';

const validate = require('validate.js');

const inputDefaults = {
  name: { value: '', error: '' },
  event: { value: 0, options: [], error: '' },
  post: { value: 0, options: [], error: '' },
  role: { value: 0, options: [], error: '' },
  singleUse: true,
};

const Invitations = () => {
  const invitations = useSelector((state) => state.system.invitations);
  const [inputs, setInputs] = useState(inputDefaults);

  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const [pageError, setPageError] = useState({});
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  const trimDecorator = (value) => value.trim();

  validate.validators.selector = (value) => {
    if (!value) {
      return 'This field is required.';
    }
    return undefined;
  };

  useEffect(() => {
    const removeModal = () => {
      window.$('#addInvModal').modal('hide');
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
    restGet(`${Constants.SERVER_PATH}api/invitations`, dispatch, removeCookie).then((result) => {
      dispatch(loadInvitations(result));
      setLoading(false);
    }).catch((error) => {
      setPageError(error);
      setLoading(false);
    });
  }, [dispatch, removeCookie]);

  useEffect(() => {
    let events,
      posts;
    restGet(`${Constants.SERVER_PATH}api/events`, dispatch, removeCookie).then((result) => {
      events = result;
    }).then(() => restGet(`${Constants.SERVER_PATH}api/posts`, dispatch, removeCookie)).then((result) => {
      posts = result;
    })
      .then(() => restGet(`${Constants.SERVER_PATH}api/roles`, dispatch, removeCookie))
      .then((result) => {
        setInputs(produce(inputs, (draft) => {
          draft.event.options = events;
          draft.post.options = posts;
          draft.role.options = result;
        }));
      })
      .catch((error) => {
        setPageError(error);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, removeCookie]);

  const addInvitation = () => {
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
      restPut(`${Constants.SERVER_PATH}api/invitations`, ({ ...validationObj, singleUse: inputs.singleUse }), dispatch, removeCookie)
        .then(() => {
          window.$('#addInvModal').modal('hide');
          setDialogLoading(false);
          restGet(`${Constants.SERVER_PATH}api/invitations`, dispatch, removeCookie).then((result) => {
            dispatch(loadInvitations(result));
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

  const copyShit = (key) => {
    navigator.clipboard.writeText(`${window.location.host}/registration?key=${key}`);
  };

  const renderAddInvModal = () => {
    const radioChange = (e) => {
      const singleUse = e.target.value === 'single';
      setInputs(produce(inputs, (draft) => {
        draft.singleUse = singleUse;
      }));
    };

    const contextual = { inputs, setInputs, isLoading: dialogLoading };

    const modalBody = (
      <React.Fragment>
        <FormRow>
          <FormGroup size="6">
            <TextInput
              contextual={contextual}
              id="inputName"
              label="Name"
              inputKey="name"
              constraint={{ value: rules.name }}
              decorators={[trimDecorator]}
            />
          </FormGroup>
          <FormGroup size="6">
            <SelectInput
              contextual={contextual}
              id="inputEvent"
              label="Event"
              inputKey="event"
              constraint={{ value: rules.event }}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup size="6">
            <SelectInput
              contextual={contextual}
              id="inputPost"
              label="Post"
              inputKey="post"
              constraint={{ value: rules.post }}
            />
          </FormGroup>
          <FormGroup size="6">
            <SelectInput
              contextual={contextual}
              id="inputRole"
              label="Role"
              inputKey="role"
              constraint={{ value: rules.role }}
            />
          </FormGroup>
        </FormRow>
        <div className="form-check form-check-inline">
          <input onChange={radioChange} className="form-check-input" type="radio" name="inputSingleUse" id="inputSingleUse" value="single" checked={inputs.singleUse}/>
          <label className="form-check-label" htmlFor="inlineRadio1">Single use</label>
        </div>
        <div className="form-check form-check-inline">
          <input onChange={radioChange} className="form-check-input" type="radio" name="inputSingleUse" id="inputSingleUse" value="multiple" checked={!inputs.singleUse}/>
          <label className="form-check-label" htmlFor="inlineRadio2">Multiple use</label>
        </div>
      </React.Fragment>
    );

    const modalFooter = (
      <React.Fragment>
        <button type="button" className="btn btn-secondary" data-dismiss="modal" disabled={dialogLoading}>Close</button>
        <button onClick={addInvitation} type="button" className="btn btn-primary" disabled={dialogLoading}>
          {dialogLoading
          && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
          Add invitation
        </button>
      </React.Fragment>
    );

    return <Modal id="addInvModal" title="Add invitation" body={modalBody} footer={modalFooter} isLoading={dialogLoading} error={dialogError}/>;
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
        <div style={{ width: 800 }}>
          <h1 className="text-center display-4">Invitations</h1>
          <div className="d-flex justify-content-center mt-4">
            <button onClick={() => {
              setInputs(produce(inputDefaults, (draft) => {
                setDialogError('');
                draft.event.options = inputs.event.options;
                draft.post.options = inputs.post.options;
                draft.role.options = inputs.role.options;
                document.getElementById('inputEvent').value = '';
                document.getElementById('inputPost').value = '';
                document.getElementById('inputRole').value = '';
              }));
            }} className="btn btn-outline-primary ml-2" data-toggle="modal" data-target="#addInvModal">Add invitation</button>
          </div>
        </div>
      </div>
      <div className="table-responsive mt-4">
        <table className="table">
          <thead>
          <tr>
            <th className="text-center">Name</th>
            <th className="text-center">Event</th>
            <th className="text-center">Post</th>
            <th className="text-center">Role</th>
            <th className="text-center">Used</th>
            <th className="text-center">Link</th>
          </tr>
          </thead>
          <tbody>
          {invitations.map((inv) => (
            <tr key={inv.id}>
              <td className="text-center">{inv.name}</td>
              <td className="text-center">{inv.event}</td>
              <td className="text-center">{inv.post}</td>
              <td className="text-center">{inv.role}</td>
              <td className="text-center">{inv.used}/{inv.singleUse ? '1' : '∞'}</td>
              <td className="text-center"><button onClick={() => copyShit(inv.regKey)} className="btn btn-link m-0 p-0">Copy link</button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      {renderAddInvModal()}
    </React.Fragment>
  );
};

export default Invitations;
