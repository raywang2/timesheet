const moment = require('moment');
const year = moment().year();

// source: https://data.gov.tw/dataset/14718
const calender = require(`./${year}.json`);
const startDate = moment().startOf('month').format(moment.HTML5_FMT.DATE);
const endDate = moment().endOf('month').format(moment.HTML5_FMT.DATE);
const format = 'YYYYMMDD';
const yearHeader = '西元日期';
const isHolidays = '是否放假';

const workdays = calender.filter(
  (x) =>
    moment(x[yearHeader], format).isBetween(startDate, endDate, 'date', '[]') &&
    x[isHolidays] === '0'
);

module.exports = workdays;
