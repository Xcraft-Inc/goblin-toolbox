const CronParser = require('cron-parser'); // FIXME: don't work !!!
const Shredder = require('xcraft-core-shredder');
const {date} = require('xcraft-core-converters');
const DateConverters = date;

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, optional)

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
      result.push(put(numbers[i]) + ' à ' + put(numbers[j]));
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
    putInvervals(result, array, n => DateConverters.getDOWDescription(n - 1));
  }
  return getOptionalText(result.join(', '));
}

// Return a recurrence of months. By example:
// '1,2,3,4,5,6,7,8,9,10,11,12' -> 'janvier à décembre'
// '3,4,5,12' -> 'mars à mai, décembre'
function getDisplayedMonths(canonicalMonths) {
  let result = [];
  if (canonicalMonths) {
    const array = canonicalMonths.split(',');
    putInvervals(result, array, n =>
      DateConverters.getMonthDescription(n - 1, 'l')
    );
  }
  return result.join(', ');
}

// Return a cron expression. By example:
// 0 0 0 * * 1,4
// 0 0 0 * * 2
// 0 0 0 * * 1-5
function getCron(canonicalDays) {
  let days = [];
  for (let d of canonicalDays.split(',')) {
    if (d === '7') {
      d = 0; // sunday
    }
    days.push(d);
  }
  canonicalDays = days.join(',');
  return `0 0 0 * * ${canonicalDays}`;
}

// Return a list of dates, according to 'cron' definition.
function computeCronDates(startDate, endDate, days) {
  const result = [];
  //?console.log (`computeCronDates-start ${startDate} ${endDate}`);
  if (days) {
    const cron = getCron(days);
    const options = {
      currentDate: DateConverters.canonicalToJs(
        DateConverters.addDays(startDate, -1) // -1 because first step
      ),
      endDate: DateConverters.canonicalToJs(
        DateConverters.addDays(endDate, 10) // little more (cron bug ?)
      ),
      iterator: true,
    };
    try {
      const interval = CronParser.parseExpression(cron, options);
      /* eslint no-constant-condition: 0 */
      while (true) {
        const next = interval.next();
        if (next.done) {
          break;
        }
        const date = DateConverters.jsToCanonical(next.value);
        if (date >= startDate && date <= endDate) {
          result.push(date);
        }
      }
    } catch (e) {}
  }
  //?console.log (`computeCronDates-end ${result.length}`);
  return result;
}

function clipAddDates(startDate, endDate, addDates) {
  const result = [];
  for (const date of addDates.toArray()) {
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
  const isCron = cronDates.toArray().indexOf(date) !== -1;
  const isInsideAdd = addDates.toArray().indexOf(date) !== -1;
  return !!(isCron ^ isInsideAdd);
}

// Return a nice sorted summary of dates to add or remove.
function getDatesSummary(addDates, cronDates, type) {
  addDates = new Shredder(addDates).toArray();
  cronDates = new Shredder(cronDates).toArray();
  const array = [];
  for (const d of addDates) {
    const index = cronDates.indexOf(d);
    if (type === 'add' && index === -1) {
      array.push(d);
    }
    if (type === 'sub' && index !== -1) {
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
  //XXX: rewrite logic in imm.
  cronDates = new Shredder(cronDates).toArray();
  addDates = new Shredder(addDates).toArray();
  let total = 0;
  for (const date of cronDates) {
    if (addDates.indexOf(date) === -1) {
      total++;
    }
  }
  for (const date of addDates) {
    if (cronDates.indexOf(date) === -1) {
      total++;
    }
  }
  return total;
}

//-----------------------------------------------------------------------------
exports.getDisplayedDays = getDisplayedDays;
exports.getDisplayedMonths = getDisplayedMonths;
exports.getDatesSummary = getDatesSummary;
exports.getTotal = getTotal;
exports.computeCronDates = computeCronDates;
exports.clipAddDates = clipAddDates;
exports.hasRecurrence = hasRecurrence;
