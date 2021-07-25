const fetch = require('node-fetch');
const https = require('https');
const moment = require('moment-timezone');

const { AUTHORIZATION, TOKEN, X_CUSTOM_HEADER, HOST } = require('./config');

function generateWorkLength() {
  const min = 5 * 60 * 60;
  const max = 6 * 60 * 60;

  return Math.floor(Math.random() * (max - min) + min);
}

function log() {
  const body = {
    workItemId: 201435,
    comment: '',
    activityTypeId: '16f814c6-f8d4-4b68-bfa7-40ffa94b59ce',
    userId: '18480d65-b5f6-4e06-a18a-ff1998ebd6a4',
  };

  const workDays = Array.from({ length: moment().daysInMonth() })
    .fill({ ...body })
    .map((x, i) => ({
      ...x,
      length: generateWorkLength(),
      timestamp: moment.tz('UTC').startOf('month').add(i, 'days').toISOString(),
    }))
    .filter((x) => [6, 7].includes(moment(x.timestamp).isoWeekday()) === false);

  const host = `https://${HOST}/api-internal/rest/worklogs/batch?api-version=3.1`;

  const headers = {
    'content-type': 'application/json;charset=UTF-8',
    authorization: AUTHORIZATION,
    token: TOKEN,
    'x-custom-header': X_CUSTOM_HEADER,
  };

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  return fetch(host, {
    headers,
    body: JSON.stringify(workDays),
    method: 'POST',
    agent: httpsAgent,
  })
    .then((e) => console.log(e))
    .catch((e) => console.log('error', e));
}

log();
