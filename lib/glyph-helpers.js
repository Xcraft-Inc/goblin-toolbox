const maps = {
  transport: new Map([
    ['bike', 'solid/bicycle'],
    ['cargo', 'light/cube'],
    ['car', 'solid/car'],
    ['train', 'solid/train'],
    ['truck', 'solid/truck'],
    ['rocket', 'solid/rocket'],
  ]),
  photo: new Map([
    ['default', 'solid/user'],
    ['secret', 'solid/user-secret'],
    ['male', 'solid/male'],
    ['female', 'solid/female'],
    ['child', 'solid/child'],
    ['smile', 'solid/smile'],
    ['meh', 'solid/meh'],
    ['frown', 'solid/frown'],
    ['poo', 'solid/poo'],
    ['triangle', 'solid/triangle'],
    ['square', 'solid/square'],
    ['hexagon', 'solid/hexagon'],
    ['octagon', 'solid/octagon'],
    ['circle', 'solid/circle'],
    ['badge', 'solid/badge'],
    ['certificate', 'solid/certificate'],
    ['star', 'solid/star'],
    ['heart', 'solid/heart'],
    ['asterisk', 'solid/asterisk'],
    ['king', 'solid/chess-king'],
    ['queen', 'solid/chess-queen'],
    ['bishop', 'solid/chess-bishop'],
    ['pawn', 'solid/chess-pawn'],
    ['rook', 'solid/chess-rook'],
    ['knight', 'solid/chess-knight'],
    ['gem', 'solid/gem'],
    ['trophy', 'solid/trophy'],
    ['random', 'solid/random'],
  ]),
  desk: new Map([
    ['asterisk', 'solid/asterisk'],
    ['ban', 'solid/ban'],
    ['bell', 'solid/bell'],
    ['binoculars', 'solid/binoculars'],
    ['bullhorn', 'solid/bullhorn'],
    ['check', 'solid/check-square'],
    ['cog', 'solid/cog'],
    ['eye', 'solid/eye'],
    ['lock', 'solid/lock'],
    ['minus', 'solid/minus-circle'],
    ['plus', 'solid/plus-circle'],
    ['share', 'solid/share-alt'],
    ['star', 'solid/star'],
    ['trash', 'solid/trash'],
    ['warning', 'solid/exclamation-triangle'],
  ]),
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
  ['means-of-payment']: new Map([
    ['invoice', 'solid/file-alt'],
    ['prepaid', 'solid/check-circle'],
    ['cash', 'solid/money-bill-alt'],
    ['credit-card', 'regular/credit-card'],
    ['postFinance', 'regular/credit-card-blank'],
  ]),
  ['ticket-type']: new Map([
    ['pick', {glyph: 'solid/plus-square', color: 'pick'}],
    ['drop', {glyph: 'solid/minus-square', color: 'drop'}],
    ['pick-transit', {glyph: 'regular/plus-square', color: 'pick'}],
    ['drop-transit', {glyph: 'regular/minus-square', color: 'drop'}],
    ['task', {glyph: 'solid/square', color: 'task'}],
  ]),
};

function getTable(category) {
  const table = [];
  const m = maps[category];
  if (m) {
    for (const item of m) {
      table.push({glyph: item[1], text: item[0]});
    }
  } else {
    console.error(`Unknown glyph category '${category}'`);
  }
  return table;
}

function getGlyph(category, text) {
  if (!text) {
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

function getComboGlyph(category, text) {
  if (text) {
    const glyph = getGlyph(category, text);
    return {glyph};
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
