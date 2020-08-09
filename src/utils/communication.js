import { logOut } from '../actions/userActions';

const restFetch = (url, onSucces, errorSetter, dispatch, removeCookie) => new Promise((resolve) => {
  const payload = {};
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  }).then((result) => {
    payload.status = result.status;
    return result.json();
  }).then((result) => {
    if (result.succeed) {
      errorSetter({});
      onSucces(result.payload);
      resolve();
    } else if (!result.authenticated) {
      removeCookie('loggedin', { path: '/' });
      dispatch(logOut());
      resolve();
    } else {
      payload.message = result.message;
      console.log(payload);
      errorSetter(payload);
      resolve();
    }
  }).catch((error) => {
    errorSetter({ message: 'Failed to connect to the server.' });
    console.log(`Error: ${error.message}`);
    resolve();
  });
});

export default restFetch;