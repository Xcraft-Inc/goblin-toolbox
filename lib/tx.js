'use strict';

const goblinName = 'tx';

const Goblin = require('xcraft-core-goblin');

// Define initial logic values
const logicState = {
  id: goblinName,
  pool: {},
  transactions: {},
};

// Define logic handlers according rc.json
const logicHandlers = {
  open: (state, action) => {
    const ressources = action.get('ressources');
    const txId = action.get('txId');
    let newPool = state.get('pool');
    newPool = newPool.merge(ressources);
    state = state.set('pool', newPool);
    state = state.set(`transactions.${txId}`, ressources);
    return state;
  },
  close: (state, action) => {
    const txId = action.get('txId');
    const ressources = state.get(`transactions.${txId}`);
    let newPool = state.get('pool');
    newPool = newPool.deleteAll(ressources);
    state = state.set('pool', newPool);
    state = state.delete(`transactions.${txId}`);
    return state;
  },
};

Goblin.registerQuest(goblinName, 'init', function(quest) {
  console.log('\x1b[32m%s\x1b[0m', 'Goblin-Toolbox: TX [RUNNING]');
});

Goblin.registerQuest(goblinName, 'open', function(quest, ressources) {
  const res = quest.goblin.getState().get('ressources');
  for (const r of ressources) {
    if (res.has(r)) {
      return null;
    }
  }
  const txId = quest.uuidV4();
  quest.do({txId});
  return txId;
});

Goblin.registerQuest(goblinName, 'close', function(quest, txId) {
  quest.do();
});

// Singleton
module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
Goblin.createSingle(goblinName);
