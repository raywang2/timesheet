const { parsed: config } = require('dotenv').config();

const inquirer = require('inquirer');

const fetch = require('node-fetch');
const https = require('https');
const moment = require('moment-timezone');
const crypto = require('crypto');

const workdays = require('./calendars');

const yearHeader = '西元日期';
const format = 'YYYYMMDD';

function log(userInput) {
  const {
    activityTypeId,
    authorization,
    host,
    token,
    userId,
    workItemId,
    xCustomHeader,
  } = userInput;

  const body = {
    workItemId,
    comment: '',
    activityTypeId,
    userId,
  };

  console.log('workdays:', workdays);
  console.log('# workday:', workdays.length);

  const payload = workdays.map((x) => ({
    ...body,
    length: crypto.randomInt(5 * 60 * 60, 6 * 60 * 60 + 1),
    timestamp: moment.tz(x[yearHeader], format, 'UTC').toISOString(),
  }));

  console.log('payload:', payload);

  const url = `https://${host}/api-internal/rest/worklogs/batch?api-version=3.1`;

  const headers = {
    'content-type': 'application/json;charset=UTF-8',
    authorization,
    token,
    'x-custom-header': xCustomHeader,
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

const questions = [
  {
    type: 'input',
    name: 'authorization',
    message: 'what is your authorization?',
    when(answers) {
      if (!config?.AUTHORIZATION) {
        return true;
      }
      answers.authorization = config.AUTHORIZATION;
    },
  },
  {
    type: 'input',
    name: 'token',
    message: 'what is your token?',
    when(answers) {
      if (!config?.TOKEN) {
        return true;
      }
      answers.token = config.TOKEN;
    },
  },
  {
    type: 'input',
    name: 'xCustomHeader',
    message: 'what is your x-custom-header?',
    when(answers) {
      if (!config?.X_CUSTOM_HEADER) {
        return true;
      }
      answers.xCustomHeader = config.X_CUSTOM_HEADER;
    },
  },
  {
    type: 'input',
    name: 'host',
    message: 'what is your host?',
    when(answers) {
      if (!config?.HOST) {
        return true;
      }
      answers.host = config.HOST;
    },
  },
  {
    type: 'input',
    name: 'activityTypeId',
    message: 'what is your activity type id?',
    when(answers) {
      if (!config?.ACTIVITY_TYPE_ID) {
        return true;
      }

      answers.activityTypeId = config.ACTIVITY_TYPE_ID;
    },
  },
  {
    type: 'input',
    name: 'workItemId',
    message: 'what is your work item id?',
    when(answers) {
      if (!config?.WORK_ITEM_ID) {
        return true;
      }

      answers.workItemId = config.WORK_ITEM_ID;
    },
  },
  {
    type: 'input',
    name: 'userId',
    message: 'what is your user id?',
    when(answers) {
      if (!config?.USER_ID) {
        return true;
      }
      answers.userId = config.USER_ID;
    },
  },
];

console.log('Hi, welcome to time sheet');

inquirer
  .prompt(questions)
  .then((userInput) => {
    log(userInput);
  })
  .catch((error) => console.error(error));
