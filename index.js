const {
  parsed: {
    AUTHORIZATION,
    TOKEN,
    X_CUSTOM_HEADER,

    HOST,

    ACTIVITY_TYPE_ID,
    USER_ID,
    WORK_ITEM_ID,
  },
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
    workItemId: WORK_ITEM_ID,
    comment: '',
    activityTypeId: ACTIVITY_TYPE_ID,
    userId: USER_ID,
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
