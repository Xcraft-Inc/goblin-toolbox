'use strict';

const goblinName = 'tx';
const {locks} = require('xcraft-core-utils');
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
    const txId = action.get('txId');
    const ressources = action.get('ressources');
    const rObj = ressources.reduce((s, id) => {
      s[id] = id;
      return s;
    }, {});

    state = state.merge('pool', rObj);
    state = state.set(`transactions.${txId}`, ressources);
    return state;
  },
  close: (state, action) => {
    const txId = action.get('txId');
    const ressources = state.get(`transactions.${txId}`).toArray();
    let newPool = state.get('pool');
    newPool = newPool.deleteAll(ressources);
    state = state.set('pool', newPool);
    state = state.del(`transactions.${txId}`);
    return state;
  },
};

Goblin.registerQuest(goblinName, 'init', function(quest) {
  console.log('\x1b[32m%s\x1b[0m', 'Goblin-Toolbox: TX [RUNNING]');
});

const openMutex = locks.getMutex;
Goblin.registerQuest(goblinName, 'open', function*(quest, ressources) {
  const pool = quest.goblin.getState().get('pool');
  for (const r of ressources) {
    if (pool.has(r)) {
      return null;
    }
  }
  const txId = quest.uuidV4();
  yield openMutex.lock(txId);
  quest.defer(() => openMutex.unlock(txId));
  quest.do({txId});
  return txId;
});

Goblin.registerQuest(goblinName, 'close', function(quest, txId) {
  quest.do();
});

// Singleton
module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
Goblin.createSingle(goblinName);
