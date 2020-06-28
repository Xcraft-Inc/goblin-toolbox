const maps = {
  place: new Map([
    ['', 'solid/map-marker-alt'],
    ['bank', 'solid/university'],
    ['box', 'light/cube'],
    ['building', 'solid/building'],
    ['hospital', 'regular/hospital'],
    ['hotel', 'solid/bed'],
    ['house', 'solid/home'],
    ['mailbox', 'solid/envelope'],
    ['park', 'solid/tree'],
    ['railway-station', 'solid/train'],
    ['subway-station', 'solid/subway'],
    ['taxi-station', 'solid/taxi'],
  ]),
  ['contact-mean']: new Map([
    ['phone', 'solid/phone'],
    ['email', 'solid/at'],
    ['skype', 'brands/skype'],
    ['fax', 'solid/fax'],
  ]),
  note: new Map([
    ['ban', 'solid/ban'],
    ['bell', 'solid/bell'],
    ['bell-light', 'regular/bell'],
    ['bicycle', 'solid/bicycle'],
    ['bookmark', 'solid/bookmark'],
    ['bookmark-light', 'regular/bookmark'],
    ['bullhorn', 'solid/bullhorn'],
    ['car', 'solid/car'],
    ['check', 'solid/check'],
    ['circle', 'solid/circle'],
    ['clock', 'solid/clock'],
    ['close', 'solid/times'],
    ['comment', 'solid/comment'],
    ['cube', 'light/cube'],
    ['envelope', 'solid/envelope'],
    ['envelope-light', 'regular/envelope'],
    ['exclamation', 'solid/exclamation-circle'],
    ['eye', 'solid/eye'],
    ['bolt', 'solid/bolt'],
    ['heart', 'solid/heart'],
    ['heart-light', 'regular/heart'],
    ['lock', 'solid/lock'],
    ['minus', 'solid/minus-circle'],
    ['pencil', 'solid/pencil'],
    ['phone', 'solid/phone'],
    ['plus', 'solid/plus-circle'],
    ['question', 'solid/question-circle'],
    ['random', 'solid/random'],
    ['search', 'solid/search'],
    ['basket', 'solid/shopping-basket'],
    ['star', 'solid/star'],
    ['star-light', 'regular/star'],
    ['train', 'solid/train'],
    ['trash', 'solid/trash'],
    ['truck', 'solid/truck'],
    ['unlock', 'solid/unlock'],
    ['user', 'solid/user'],
    ['warning', 'solid/exclamation-triangle'],
  ]),
  ['glyph-colors']: new Map([
    ['', {glyph: 'regular/circle'}],
    ['base', {glyph: 'solid/circle', color: 'base'}],
    ['primary', {glyph: 'solid/circle', color: 'primary'}],
    ['secondary', {glyph: 'solid/circle', color: 'secondary'}],
    ['success', {glyph: 'solid/circle', color: 'success'}],
    ['pick', {glyph: 'solid/circle', color: 'pick'}],
    ['drop', {glyph: 'solid/circle', color: 'drop'}],
    ['task', {glyph: 'solid/circle', color: 'task'}],
  ]),
  ['means-of-payment']: new Map([
    ['', 'no-glyph'],
    ['invoice', 'solid/file-alt'],
    ['prepaid', 'solid/check-circle'],
    ['cash', 'solid/money-bill-alt'],
    ['credit-card', 'regular/credit-card'],
    ['postFinance', 'regular/credit-card-blank'],
  ]),
};

//-----------------------------------------------------------------------------

function getTable(category) {
  const table = [];
  const m = maps[category];
  if (m) {
    for (const item of m) {
      table.push({id: item[0], text: item[0], glyph: item[1]});
    }
  } else {
    console.error(`Unknown glyph category '${category}'`);
  }
  return table;
}

function getGlyph(category, text) {
  if (!text && text !== '') {
    return null;
  }
  if (text.indexOf('/') !== -1) {
    // If text is already 'solid/xyz', there are a problem!
    console.error(`Text '${text}' for glyph has incompatible format`);
  }
  const m = maps[category];
  if (m) {
    return m.get(text);
  } else {
    console.error(`Unknown glyph category '${category}'`);
    return 'solid/exclamation';
  }
}

function getComboGlyph(category, text, defaultGlyph) {
  if (text || text === '') {
    const glyph = getGlyph(category, text);
    if (!glyph && defaultGlyph) {
      return {glyph: defaultGlyph};
    } else {
      return {glyph};
    }
  } else {
    return null;
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getTable,
  getGlyph,
  getComboGlyph,
};
