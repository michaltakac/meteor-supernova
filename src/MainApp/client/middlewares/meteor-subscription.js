/* global Meteor */
//import Promise from 'bluebird';
import actionTypeBuilder from '../actions/actionTypeBuilder';
import { SUBSCRIPTIONS } from '../actions/subscriptions';

const handles = [];
const computations = [];

export default store => next => action => {
  if (!action.meteor || !action.meteor.subscribe) {
    return next(action);
  }

  const { subscribe, get, onChange } = action.meteor;

  // If we already have an handle for this action
  if (handles[action.type]) {
    const subscriptionId = handles[action.type].subscriptionId;
    computations[subscriptionId].stop();
    handles[action.type].stop();
  }

  const handle = subscribe();
  const subscriptionId = handle.subscriptionId;
  handles[action.type] = handle;

  computations[subscriptionId] = Tracker.autorun(() => {
    const data = get();
    const ready = handle.ready();

    store.dispatch({
      type: actionTypeBuilder.ready(action.type),
      ready,
    });

    if (ready) {
      if (onChange) {
        onChange(data);
      }

      store.dispatch({
        type: actionTypeBuilder.changed(action.type),
        data,
      });
    }
  });
};
