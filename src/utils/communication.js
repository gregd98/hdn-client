import { logOut } from '../actions/userActions';

const communication = (url, method, body, dispatch, removeCookie) => new Promise(
  (resolve, reject) => {
    const payload = {};
    const init = { method, credentials: 'include' };
    if (body) {
      init.body = JSON.stringify(body);
    }
    fetch(url, init).then((result) => {
      payload.status = result.status;
      return result.json();
    }).then((result) => {
      if (result.succeed) {
        if (method === 'GET') {
          resolve(result.payload);
        } else {
          resolve();
        }
      } else if (!result.authenticated) {
        removeCookie('loggedin', { path: '/' });
        dispatch(logOut());
        payload.message = 'Unauthenticated.';
        reject(payload);
      } else {
        payload.message = result.message;
        if (result.inputErrors) {
          payload.inputErrors =  result.inputErrors;
        }
        console.log(payload);
        reject(payload);
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
      payload.message = 'Failed to connect to the server.';
      reject(payload);
    });
  },
);

export const restGet = (url, dispatch, removeCookie) => new Promise((resolve, reject) => {
  communication(url, 'GET', null, dispatch, removeCookie).then((result) => resolve(result)).catch((error) => reject(error));
});

export const restDelete = (url, dispatch, removeCookie) => new Promise((resolve, reject) => {
  communication(url, 'DELETE', null, dispatch, removeCookie).then((result) => resolve(result)).catch((error) => reject(error));
});

export const restPut = (url, body, dispatch, removeCookie) => new Promise((resolve, reject) => {
  communication(url, 'PUT', body, dispatch, removeCookie).then((result) => resolve(result)).catch((error) => reject(error));
});

export const restPost = (url, body, dispatch, removeCookie) => new Promise((resolve, reject) => {
  communication(url, 'POST', body, dispatch, removeCookie).then((result) => resolve(result)).catch((error) => reject(error));
});
