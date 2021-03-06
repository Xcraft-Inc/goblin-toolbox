'use strict';

const Shredder = require('xcraft-core-shredder');
const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

const {date, month, dow} = require('xcraft-core-converters');
const DateConverters = date;
const MonthConverters = month;
const DowConverters = dow;

function getOptionalText(text) {
  if (!text || text === '') {
    return '—'; // U+2014 (tiret cadratin)
  } else {
    return text;
  }
}

function putInvervals(result, array, put) {
  const numbers = [];
  for (let item of array) {
    if (typeof item === 'string') {
      item = parseInt(item);
    }
    numbers.push(item);
  }
  let i = 0;
  while (i < numbers.length) {
    let j = i + 1;
    while (j < numbers.length) {
      if (numbers[i] !== numbers[j] - j + i) {
        break; // break if not contiguous
      }
      j++;
    }
    j--;
    if (j - i < 2) {
      result.push(put(numbers[i]));
      i++;
    } else {
      result.push(
        StringBuilder.joinWords(put(numbers[i]), T('à'), put(numbers[j]))
      );
      i = j + 1;
    }
  }
}

// Return a recurrence of days. By example:
// '1,2,3,4,5' -> 'lun à ven'
// '1,2,4,5,6' -> 'lun, mar, jeu à sam'
// '6,7' -> 'sam, dim'
// '1,2,3,7' -> 'lun à mer, dim'
function getDisplayedDays(canonicalDays) {
  const result = [];
  if (canonicalDays) {
    const array = canonicalDays.split(',');
    putInvervals(result, array, (n) => DowConverters.getDisplayed(n));
  }
  return getOptionalText(StringBuilder.join(result, ', '));
}

// Return a recurrence of months. By example:
// '1,2,3,4,5,6,7,8,9,10,11,12' -> 'janvier à décembre'
// '3,4,5,12' -> 'mars à mai, décembre'
function getDisplayedMonths(canonicalMonths) {
  const result = [];
  if (canonicalMonths) {
    const array = canonicalMonths.split(',');
    putInvervals(result, array, (n) =>
      MonthConverters.getDisplayed(n, 'long-lower')
    );
  }
  return StringBuilder.join(result, ', ');
}

// Return a list of dates, according to 'cron' definition.
function computeCronDates(startDate, endDate, days) {
  const result = [];
  if (!startDate || !endDate) {
    return result;
  }
  // console.log(`computeCronDates-start ${startDate} ${endDate}`);
  startDate = DateConverters.canonicalToJs(startDate);
  endDate = DateConverters.canonicalToJs(endDate);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();

  let dow = startDate.getDay(); // 0=sunday, 1=monday, 2=thusday, usw.
  let dayCount = (endDate - startDate) / (1000 * 24 * 60 * 60);

  const arrayDays = [];
  for (let d = 0; d < 7; d++) {
    arrayDays.push(false);
  }
  if (days) {
    for (let d of days.split(',')) {
      if (d === '7') {
        d = 0; // sunday
      }
      arrayDays[Number(d)] = true;
    }
  }

  for (let dayIndex = 0; dayIndex <= dayCount; dayIndex++) {
    if (arrayDays[dow]) {
      const currentDate = new Date(startYear, startMonth, startDay + dayIndex);
      const date = DateConverters.jsToCanonical(currentDate);
      result.push(date);
    }
    dow = (dow + 1) % 7;
  }
  // console.log(`computeCronDates-end ${result.length}`);
  return result;
}

function clipAddDates(startDate, endDate, addDates) {
  const result = [];
  for (const date of addDates.values()) {
    if (date >= startDate && date <= endDate) {
      result.push(date);
    }
  }
  return result;
}

// Indicates if a date corresponds to a recurrence.
function hasRecurrence(startDate, endDate, days, addDates, cronDates, date) {
  if (date < startDate || date > endDate) {
    return false; // out of period
  }
  const isCron = cronDates.includes(date);
  const isInsideAdd = addDates.includes(date);
  return !!(isCron ^ isInsideAdd);
}

// Return a nice sorted summary of dates to add or remove.
function getDatesSummary(addDates, cronDates, type) {
  addDates = new Shredder(addDates);
  cronDates = new Shredder(cronDates);
  const array = [];
  for (const d of addDates.values()) {
    const exist = cronDates.includes(d);
    if (type === 'add' && !exist) {
      array.push(d);
    }
    if (type === 'sub' && exist) {
      array.push(d);
    }
  }
  array.sort();
  const result = [];
  for (const d of array) {
    result.push(DateConverters.getDisplayed(d));
  }
  return getOptionalText(result.join(', '));
}

function getTotal(cronDates, addDates) {
  cronDates = new Shredder(cronDates);
  addDates = new Shredder(addDates);
  let total = cronDates.size;
  for (const date of addDates.values()) {
    if (cronDates.includes(date)) {
      total--;
    } else {
      total++;
    }
  }
  return total;
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayedDays,
  getDisplayedMonths,
  getDatesSummary,
  getTotal,
  computeCronDates,
  clipAddDates,
  hasRecurrence,
};
