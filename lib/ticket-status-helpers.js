//T:2019-04-16
const T = require('goblin-nabu/widgets/helpers/t.js');
// This map describes texts and glyphs for UI.
const statusDescriptions = {
  'in-mission': {text: T('Juste créé'), glyph: 'regular/play-circle'},
  'in-preparation': {text: T('En préparation'), glyph: 'regular/circle'},
  'pre-dispatched': {text: T('Non dispatché'), glyph: 'regular/square'},
  'dispatched': {text: T('Dispatché'), glyph: 'regular/check-square'},
  'executed': {text: T('Exécuté'), glyph: 'solid/check-square'},
};

// This map describes all the possible status, as well as their sequences.
const statusMap = new Map([
  [
    'pre-dispatched',
    {
      order: 1,
      prev: 'executed',
      next: 'dispatched',
    },
  ],
  [
    'dispatched',
    {
      order: 2,
      prev: 'pre-dispatched',
      next: 'executed',
    },
  ],
  [
    'executed',
    {
      order: 3,
      prev: 'dispatched',
      next: 'pre-dispatched',
    },
  ],
]);

const ownerKindTexts = {
  order: 'co-dispo',
  backlog: 'backlog',
  roadbook: 'roadbook',
  desk: 'desk',
};

//-----------------------------------------------------------------------------

function getStatusMenu(currentStatus) {
  const result = [];
  for (const item of statusMap) {
    const s = item[0];
    const m = item[1];
    const description = statusDescriptions[s];
    result.push({
      status: s,
      text: description.text,
      glyph: description.glyph,
      active: currentStatus === s,
      shortcut: currentStatus === m.prev ? 'clic' : null,
    });
  }
  return result;
}

function getNextStatus(status) {
  const item = statusMap.get(status);
  return item ? item.next : null;
}

function getStatusOrder(status) {
  const item = statusMap.get(status);
  return item ? item.order : 0;
}

function getStatusText(status) {
  const description = statusDescriptions[status];
  return description ? description.text : '?';
}

function getStatusDescription(status) {
  if (!status) {
    status = 'in-mission';
  }
  return statusDescriptions[status];
}

function getOwnerKindText(ownerKind) {
  return ownerKindTexts[ownerKind] || ownerKind;
}

//-----------------------------------------------------------------------------

module.exports = {
  getStatusMenu,
  getNextStatus,
  getStatusOrder,
  getStatusText,
  getStatusDescription,
  getOwnerKindText,
};
