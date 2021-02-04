import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { signupConstraints as rules } from '../constraints/signupConstraints';
import { isValidCNP } from '../utils/cnp';
import calculatePasswordStrength from '../utils/password';
import * as Constants from '../constants';
import { restGet, restPut } from '../utils/communication';
import { loadUserData, logIn } from '../actions/userActions';
import ErrorPage from './error_page.jsx';
import LoadingPage from './loading_page.jsx';

const  classNames = require('classnames');
const validate = require('validate.js');

const trimDecorator = (value) => value.trim();
const lowerCaseDecorator = (value) => value.toLowerCase();
// const upperCaseDecorator = (value) => value.toUpperCase();
const capitalizeDecorator = (value) => (
  value ? value[0].toUpperCase() + value.slice(1).toLowerCase() : value
);
const trimAllDecorator = (value) => value.replace(/\s/g, '');

const useQuery = () => new URLSearchParams(useLocation().search);

// eslint-disable-next-line max-lines-per-function
const Registration = () => {
  const query = useQuery();
  // const [regCode, setRegCode] = useState({ value: '', error: '', ref: React.createRef() });
  const [firstName, setFirstName] = useState({ value: '', error: '', ref: React.createRef() });
  const [lastName, setLastName] = useState({ value: '', error: '', ref: React.createRef() });
  const [email, setEmail] = useState({ value: '', error: '', ref: React.createRef() });
  const [phone, setPhone] = useState({ value: '', error: '', ref: React.createRef() });
  const [cnp, setCnp] = useState({ value: '', error: '', ref: React.createRef() });
  const [shirtType, setShirtType] = useState({
    selectedId: 0, error: '', options: [], ref: React.createRef(),
  });
  const [shirtSize, setShirtSize] = useState({
    selectedId: 0, error: '', options: [], ref: React.createRef(),
  });
  const [username, setUsername] = useState({ value: '', error: '', ref: React.createRef() });
  const [password, setPassword] = useState({ value: '', error: '', ref: React.createRef() });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '', ref: React.createRef() });
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [regKey] = useState(query.get('key'));
  const [pageError, setPageError] = useState({});
  const [isLoading, setLoading] = useState(true);

  const history = useHistory();

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restGet(`${Constants.SERVER_PATH}api/userData`, dispatch, removeCookie).then((result) => {
      dispatch(logIn());
      dispatch(loadUserData(result));
    });
  }, [dispatch, removeCookie]);

  useEffect(() => {
    restGet(`${Constants.SERVER_PATH}api/regKey?key=${regKey}`, dispatch, removeCookie).then((result) => {
      if (!result) {
        setPageError({ message: 'Invalid registration link.' });
      }
      setLoading(false);
    });
  }, [dispatch, regKey, removeCookie]);

  const fields = {
    // regCode: { state: regCode, setState: setRegCode, order: 1 },
    firstName: { state: firstName, setState: setFirstName, order: 2 },
    lastName: { state: lastName, setState: setLastName, order: 3 },
    email: { state: email, setState: setEmail, order: 4 },
    phone: { state: phone, setState: setPhone, order: 5 },
    cnp: { state: cnp, setState: setCnp, order: 6 },
    shirtType: { state: shirtType, setState: setShirtType, order: 7 },
    shirtSize: { state: shirtSize, setState: setShirtSize, order: 8 },
    username: { state: username, setState: setUsername, order: 9 },
    password: { state: password, setState: setPassword, order: 10 },
    confirmPassword: { state: confirmPassword, setState: setConfirmPassword, order: 11 },
  };

  validate.validators.cnp = (value) => {
    if (!isValidCNP(value)) {
      return 'Enter a valid CNP.';
    }
    return undefined;
  };

  validate.validators.password = (value) => {
    if (calculatePasswordStrength(value) < 2) {
      return 'The password must contain at least two character categories among the following: uppercase characters, lowercase characters, digits, special characters.';
    }
    return undefined;
  };

  validate.validators.confirmPassword = (value) => {
    if (value !== password.value) {
      return 'Password doesn\'t match.';
    }
    return undefined;
  };

  validate.validators.selector = (value) => {
    if (!value) {
      return 'This field is required.';
    }
    return undefined;
  };

  const signUpClicked = (event) => {
    event.preventDefault();
    const validation = validate({
      // regCode: regCode.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      cnp: cnp.value,
      shirtType: shirtType.selectedId,
      shirtSize: shirtSize.selectedId,
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    }, rules, { fullMessages: false });

    if (validation) {
      let minOrder = 999,
        minKey = '';
      Object.entries(validation)
        .forEach(([key, value]) => {
          if (fields[key].order < minOrder) {
            minOrder = fields[key].order;
            minKey = key;
          }
          fields[key].setState((rest) => ({ ...rest, error: value[0] }));
        });
      fields[minKey].state.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      setBtnDisabled(true);
      const body = {
        // regCode: regCode.value,
        regCode: regKey,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        cnp: cnp.value,
        shirtType: shirtType.selectedId,
        shirtSize: shirtSize.selectedId,
        username: username.value,
        password: password.value,
      };

      restPut(`${Constants.SERVER_PATH}api/signup?key=${regKey}`, body, dispatch, removeCookie).then(() => {
        // TODO valami zoldet a loginra
        history.push(`${Constants.APP_URL_PATH}login`);
      }).catch((error) => {
        setBtnDisabled(false);
        if (error.inputErrors) {
          let minOrder = 999,
            minKey = '';
          Object.entries(error.inputErrors)
            .forEach(([key, value]) => {
              if (fields[key].order < minOrder) {
                minOrder = fields[key].order;
                minKey = key;
              }
              fields[key].setState((rest) => ({ ...rest, error: value }));
            });
          fields[minKey].state.ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else {
          // TODO egyeb error
          console.log(error.message);
        }
      });
    }
  };

  useEffect(() => {
    restGet(`${Constants.SERVER_PATH}api/shirtTypes`, dispatch, removeCookie).then((result) => {
      setShirtType((state) => ({ ...state, options: result }));
    }).then(() => restGet(`${Constants.SERVER_PATH}api/shirtSizes`, dispatch, removeCookie)).then((result) => {
      setShirtSize((state) => ({ ...state, options: result }));
    })
      .catch((error) => {
      // TODO load error
        console.log(error.message);
      });
  }, [dispatch, removeCookie]);

  const loginClicked = () => {
    history.push(`${Constants.APP_URL_PATH}login`);
  };

  if (pageError.message) {
    return <ErrorPage status={pageError.status} message={pageError.message} />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="d-flex justify-content-center">
      <form onSubmit={signUpClicked}>
        <Card title="Personal data">
          <FormRow>
            <FormGroup mdSize="6" na={firstName.ref}>
              <Input type="text" id="inputFirstName" label="First name" state={firstName} setState={setFirstName} constraint={{ value: rules.firstName }} decorators={
                [trimDecorator, capitalizeDecorator]} />
            </FormGroup>
            <FormGroup mdSize="6" na={lastName.ref}>
              <Input type="text" id="inputLastName" label="Last name" state={lastName} setState={setLastName} constraint={{ value: rules.lastName }} decorators={
                [trimDecorator, capitalizeDecorator]} />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup mdSize="6" na={email.ref}>
              <Input type="text" id="inputEmail" label="Email" state={email} setState={setEmail} constraint={{ value: rules.email }} decorators={
                [trimDecorator, lowerCaseDecorator]} />
            </FormGroup>
            <FormGroup mdSize="6" na={phone.ref}>
              <Input type="text" id="inputPhone" label="Phone" state={phone} setState={setPhone} constraint={{ value: rules.phone }} decorators={[trimAllDecorator]} />
            </FormGroup>
          </FormRow>
          <FormGroup na={cnp.ref}>
            <Input type="text" id="inputCNP" label="CNP" state={cnp} setState={setCnp} constraint={{ value: rules.cnp }} decorators={[trimDecorator]} />
          </FormGroup>
          <FormRow>
            <FormGroup mdSize="6">
              <SelectInput id="inputShirtType" label="Shirt type" state={shirtType} setState={setShirtType} constraint={{ value: rules.shirtType }} />
            </FormGroup>
            <FormGroup mdSize="6">
              <SelectInput id="inputShirtSize" label="Shirt size" state={shirtSize} setState={setShirtSize} constraint={{ value: rules.shirtSize }} />
            </FormGroup>
          </FormRow>
        </Card>
        <Card title="User data">
          <FormGroup na={username.ref}>
            <Input type="text" id="inputUsername" label="Username" state={username} setState={setUsername} constraint={{ value: rules.username }} decorators={[trimDecorator, lowerCaseDecorator]} />
          </FormGroup>
          <FormRow>
            <FormGroup mdSize="6" na={password.ref}>
              <Input type="password" id="inputPassword" label="Password" state={password} setState={setPassword} constraint={{ value: rules.password }} />
            </FormGroup>
            <FormGroup mdSize="6" na={confirmPassword.ref}>
              <Input type="password" id="inputConfirmPassword" label="Confirm password" state={confirmPassword} setState={setConfirmPassword} constraint={{ value: rules.confirmPassword }} />
            </FormGroup>
          </FormRow>
        </Card>
        <Card title="Submit">
          <button type="submit" className="btn btn-primary" disabled={btnDisabled}>
            {btnDisabled && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            Sign Up
          </button>
          <button onClick={loginClicked} type="button" className="btn btn-outline-secondary ml-2">Back to log in</button>
        </Card>
      </form>
    </div>
  );
};

const Card = (prop) => (
    <div className="card border-dark my-2 mx-3">
      <div className="card-body">
        <h4>{prop.title}</h4>
        {prop.children}
      </div>
    </div>
);

const FormRow = (prop) => (
    <div className="form-row">
      {prop.children}
    </div>
);

const FormGroup = (prop) => {
  const { children, mdSize, na } = prop;
  const classes = classNames({
    'form-group': true,
    [`col-md-${mdSize}`]: mdSize,
  });
  return (
    <div ref={na} className={classes}>
      {children}
    </div>
  );
};

const Input = (prop) => {
  const {
    type, id, label, state, setState, decorators, constraint,
  } = prop;

  const handleInputChange = (event) => {
    const { value } = event.target;
    setState((rest) => ({ ...rest, value, error: '' }));
  };

  const handleBlur = () => {
    let { value } = state;
    if (decorators) {
      for (let i = 0; i < decorators.length; i += 1) {
        value = decorators[i](value);
      }
      setState((rest) => ({ ...rest, value }));
    }
    const validation = validate({ value }, constraint, { fullMessages: false });
    if (validation) {
      setState((rest) => ({ ...rest, error: validation.value[0] }));
    }
  };

  const classes = classNames({
    'form-control': true,
    'is-invalid': state.error,
  });

  return (
    <React.Fragment>
      <label htmlFor={id}>{label}</label>
      <input onChange={handleInputChange} onBlur={handleBlur} type={type}
             className={classes} id={id} placeholder={label} value={state.value} />
      {state.error && <div className="invalid-feedback">{state.error}</div>}
    </React.Fragment>
  );
};

const SelectInput = (prop) => {
  const {
    id, label, state, setState, constraint,
  } = prop;

  const handleInputChange = (event) => {
    const { selectedIndex } = event.target;
    const selectedId = event.target[selectedIndex].id;
    setState((rest) => ({ ...rest, selectedId, error: '' }));
  };

  const handleBlur = () => {
    const { selectedId } = state;
    const validation = validate({ value: selectedId }, constraint, { fullMessages: false });
    if (validation) {
      setState((rest) => ({ ...rest, error: validation.value[0] }));
    }
  };

  const classes = classNames({
    'custom-select': true,
    'is-invalid': state.error,
  });

  return (
    <React.Fragment>
    <label htmlFor={id}>{label}</label>
    <select onChange={handleInputChange} onBlur={handleBlur}
            id={id} className={classes} >
      <option />
      {state.options.map((item) => <option key={item.id} id={item.id}>{item.name}</option>)}
    </select>
      {state.error && <div className="invalid-feedback">{state.error}</div>}
    </React.Fragment>
  );
};

export default Registration;
