const {
  parsed: { AUTHORIZATION, TOKEN, X_CUSTOM_HEADER, HOST },
} = require('dotenv').config();

const fetch = require('node-fetch');
const https = require('https');
const moment = require('moment-timezone');
const crypto = require('crypto');

const workdays = require('./calendars');

const yearHeader = '西元日期';
const format = 'YYYYMMDD';

function log() {
  const body = {
    workItemId: 201435,
    comment: '',
    activityTypeId: '16f814c6-f8d4-4b68-bfa7-40ffa94b59ce',
    userId: '18480d65-b5f6-4e06-a18a-ff1998ebd6a4',
  };

  console.log('workdays:', workdays);
  console.log('# workday:', workdays.length);

  const payload = workdays.map((x) => ({
    ...body,
    length: crypto.randomInt(5 * 60 * 60, 6 * 60 * 60 + 1),
    timestamp: moment.tz(x[yearHeader], format, 'UTC').toISOString(),
  }));

  console.log('payload:', payload);

  const url = `https://${HOST}/api-internal/rest/worklogs/batch?api-version=3.1`;

  const headers = {
    'content-type': 'application/json;charset=UTF-8',
    authorization: AUTHORIZATION,
    token: TOKEN,
    'x-custom-header': X_CUSTOM_HEADER,
  };

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  return fetch(url, {
    headers,
    body: JSON.stringify(payload),
    method: 'POST',
    agent: httpsAgent,
  })
    .then((e) => console.log(e))
    .catch((e) => console.log('error', e));
}

log();
