const moment = require('moment');

const splitInput = (date) => date.split(/[- :]/);
const convertToDateTime = (t) => new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
const convertToDate = (t) => new Date(Date.UTC(t[0], t[1] - 1, t[2], 0, 0, 0));
const balanceTimeZone = (date) => new Date(date.getTime() + date.getTimezoneOffset() * 60000);

export const getTimeByDate = (date) => moment(balanceTimeZone(convertToDateTime(splitInput(date)))).format('HH:mm');
export const getLongByDate = (date) => (convertToDate(splitInput(date))).getTime();
export const getWeekdayByDate = (date) => balanceTimeZone(convertToDateTime(splitInput(date))).toLocaleDateString('en-US', { weekday: 'long' });
