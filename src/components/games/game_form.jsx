import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { gameConstraints as rules } from '../../constraints/gameConstraints';
import { restFetch2 } from '../../utils/communication';
import * as Constants from '../../constants';

const validate = require('validate.js');
const  classNames = require('classnames');

const GameForm = () => {
  const [title, setTitle] = useState({ value: '', error: '', ref: React.createRef() });
  const [playerCount, setPlayerCount] = useState({ value: 0, error: '', ref: React.createRef() });
  const [description, setDescription] = useState({ value: '', error: '', ref: React.createRef() });
  const [notes, setNotes] = useState({ value: '', error: '', ref: React.createRef() });
  const [day, setDay] = useState({
    selectedId: 0, error: '', options: [], ref: React.createRef(),
  });
  const [startTime, setStartTime] = useState({ value: '', error: '', ref: React.createRef() });
  const [endTime, setEndTime] = useState({ value: '', error: '', ref: React.createRef() });
  const [location, setLocation] = useState({ value: '', error: '', ref: React.createRef() });
  const [timeDisabled, setTimeDisabled] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const fields = {
    title: { state: title, setState: setTitle, order: 1 },
    playerCount: { state: playerCount, setState: setPlayerCount, order: 2 },
    description: { state: description, setState: setDescription, order: 3 },
    notes: { state: notes, setState: setNotes, order: 4 },
    location: { state: location, setState: setLocation, order: 5 },
    day: { state: day, setState: setDay, order: 6 },
    startTime: { state: startTime, setState: setStartTime, order: 7 },
    endTime: { state: endTime, setState: setEndTime, order: 8 },
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const cookies = useCookies();
  const removeCookie = cookies[2];

  validate.validators.selector = (value) => {
    console.log('Day:');
    console.log(value);
    if (!value) {
      return 'This field is required.';
    }
    return undefined;
  };

  useEffect(() => {
    restFetch2(`${Constants.SERVER_PATH}api/days`, dispatch, removeCookie).then((resultDays) => {
      setDay((state) => ({
        ...state,
        options: resultDays.map((item) => {
          const date = new Date(item);
          const newDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
          return ({ id: date.getTime(), name: newDate.toLocaleDateString('en-US', { weekday: 'long' }) });
        }),
      }));
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  }, [dispatch, removeCookie]);

  const simplifyNonRequiredField = (value) => (value.trim().length === 0 ? null : value);
  const dateToSqlFormat = (value) => value.toISOString().slice(0, 16).replace('T', ' ');

  const saveGameClicked = (event) => {
    event.preventDefault();
    let validationObj = {
      title: title.value,
      playerCount: playerCount.value,
      description: description.value,
      notes: notes.value,
      location: location.value,
    };

    const currentRules = { ...rules };
    if (!timeDisabled) {
      validationObj = {
        ...validationObj,
        day: day.selectedId,
        startTime: startTime.value,
        endTime: endTime.value,
      };
    } else {
      delete currentRules.day;
      delete currentRules.startTime;
      delete currentRules.endTime;
    }

    console.log(validationObj);

    const validation = validate(validationObj, currentRules, { fullMessages: false });
    if (validation) {
      console.log(validation);
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
      console.log('Adding game');
      const data = {
        title: title.value,
        playerCount: playerCount.value,
        description: simplifyNonRequiredField(description.value),
        notes: simplifyNonRequiredField(notes.value),
        location: simplifyNonRequiredField(location.value),
      };

      if (!timeDisabled) {
        const selectedDay = Number.parseInt(day.selectedId, 10);
        const t1 = startTime.value.split(':');
        const t2 = endTime.value.split(':');
        const start = (Number.parseInt(t1[0], 10) * 3600000) + (Number.parseInt(t1[1], 10) * 60000);
        const end = (Number.parseInt(t2[0], 10) * 3600000) + (Number.parseInt(t2[1], 10) * 60000);

        const ss = new Date(selectedDay + start);
        const ee = new Date(end > start ? selectedDay + end : selectedDay + 86400000 + end);

        data.startTime = dateToSqlFormat(ss);
        data.endTime = dateToSqlFormat(ee);
      } else {
        data.startTime = null;
        data.endTime = null;
      }
      setBtnDisabled(true);
      fetch(`${Constants.SERVER_PATH}api/games`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(data),
      }).then((result) => result.json()).then((result) => {
        if (result.succeed) {
          console.log('SUCCES');
          history.push(`${Constants.APP_URL_PATH}games`);
        } else {
          let minOrder = 999,
            minKey = '';
          Object.entries(result.inputErrors)
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
        }
      });
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: 500 }}>
        <form onSubmit={saveGameClicked}>
          <Card title="Game data">
            <FormGroup na={title.ref}>
              <Input type="text" id="inputTitle" label="Title" state={title} setState={setTitle} constraint={{ value: rules.title }} />
            </FormGroup>
            <FormGroup na={playerCount.ref}>
              <RangeInput id="inputPlayerCount" label="Player count" state={playerCount} setState={setPlayerCount} constraint={{ value: rules.playerCount }} min={0} max={16}/>
            </FormGroup>
            <FormGroup na={description.ref}>
              <Input rows="4" id="inputDescription" label="Description" state={description} setState={setDescription} constraint={{ value: rules.area }} />
            </FormGroup>
            <FormGroup na={notes.ref}>
              <Input rows="4" id="inputNotes" label="Notes" state={notes} setState={setNotes} constraint={{ value: rules.area }} />
            </FormGroup>
            <FormGroup na={location.ref}>
              <Input type="text" id="inputLocation" label="Location" state={location} setState={setLocation} constraint={{ value: rules.location }} />
            </FormGroup>
          </Card>
          <Card title="Game time">
            <FormRow>
              <FormGroup mdSize="4" na={day.ref}>
                <SelectInput id="inputDay" label="Day" state={day} setState={setDay} constraint={{ value: rules.day }} disabled={timeDisabled}/>
              </FormGroup>
              <FormGroup mdSize="4" na={startTime.ref}>
                <Input type="time" id="inputStartTime" label="Start time" state={startTime} setState={setStartTime} constraint={{ value: rules.time }} disabled={timeDisabled} />
              </FormGroup>
              <FormGroup mdSize="4" na={endTime.ref}>
                <Input type="time" id="inputEndTime" label="End time" state={endTime} setState={setEndTime} constraint={{ value: rules.time }} disabled={timeDisabled} />
              </FormGroup>
            </FormRow>
            <div className="form-check">
              <input onChange={(e) => {
                setTimeDisabled(e.target.checked);
              }} className="form-check-input" type="checkbox" id="inputTimeLater" />
              <label className="form-check-label" htmlFor="inputTimeLater">Add later</label>
            </div>
          </Card>
          <Card title="Submit">
            <button type="submit" className="btn btn-primary" disabled={btnDisabled}>
              {btnDisabled && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
              Save game
            </button>
            <button type="button" className="btn btn-outline-secondary ml-2">Save game as draft</button>
          </Card>
        </form>
      </div>
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
    type, id, label, state, setState, decorators, rows, constraint, disabled,
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
    'is-invalid': !disabled && state.error,
  });

  const getInput = () => (rows ? (
      <textarea
        onChange={handleInputChange}
        onBlur={handleBlur} rows={rows}
        className={classes}
        id={id}
        placeholder={label}
        value={state.value}
        disabled={disabled}/>
  ) : (
      <input
        onChange={handleInputChange}
        onBlur={handleBlur} type={type}
        className={classes}
        id={id}
        placeholder={label}
        value={state.value}
        disabled={disabled}/>
  ));

  return (
    <React.Fragment>
      <label htmlFor={id}>{label}</label>
      {getInput()}
      { !disabled && state.error && <div className="invalid-feedback">{state.error}</div>}
    </React.Fragment>
  );
};

const SelectInput = (prop) => {
  const {
    id, label, state, setState, constraint, disabled,
  } = prop;

  const handleInputChange = (event) => {
    const { selectedIndex } = event.target;
    const selectedId = event.target[selectedIndex].id;
    setState((rest) => ({ ...rest, selectedId, error: '' }));
    // console.log(new Date(Number.parseInt(selectedId, 10)));
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
    'is-invalid': !disabled && state.error,
  });

  return (
    <React.Fragment>
      <label htmlFor={id}>{label}</label>
      <select
        onChange={handleInputChange}
        onBlur={handleBlur}
        id={id}
        className={classes}
        disabled={disabled}>
        <option />
        {state.options.map((item) => <option key={item.id} id={item.id}>{item.name}</option>)}
      </select>
      { !disabled && state.error && <div className="invalid-feedback">{state.error}</div>}
    </React.Fragment>
  );
};

const RangeInput = (input) => {
  const {
    id, label, state, setState, constraint, min, max,
  } = input;

  const handleInputChange = (event) => {
    const { value } = event.target;
    setState((rest) => ({ ...rest, value, error: '' }));

    const validation = validate({ value }, constraint, { fullMessages: false });
    if (validation) {
      setState((rest) => ({ ...rest, error: validation.value[0] }));
    }
  };

  const classes = classNames({
    'form-control-range': true,
    'is-invalid': state.error,
  });

  return (
    <React.Fragment>
      <label htmlFor={id}>{label}: <b>{state.value}</b></label>
      <input onChange={handleInputChange} min={min} max={max} type="range" className={classes} id={id} value={state.value} />
      {state.error && <div className="invalid-feedback">{state.error}</div>}
    </React.Fragment>
  );
};

export default GameForm;
