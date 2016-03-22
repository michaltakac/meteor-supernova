/* global Meteor */
import Promise from 'bluebird';
import actionTypeBuilder from '../actions/actionTypeBuilder';
import { SUBSCRIPTIONS } from '../actions/subscriptions';

const subs = {};

export default store => next => action => {
  if (!action.meteor || (!action.meteor.subscribe && !action.meteor.unsubscribe)) {
    return next(action);
  }

  return new Promise((resolve, reject) => {

    const { name } = action.meteor.subscribe || action.meteor.unsubscribe;
    const sub = subs[name];

    if (action.meteor.unsubscribe) {
      if (sub) {
        delete sub.subscribedActions[action.type];
        if (_.isEmpty(sub.subscribedActions)) {
          sub.handle.stop();
          next({ type: actionTypeBuilder.stopped(SUBSCRIPTIONS), name } );
        }
      }
      return resolve();
    }

    const { params, get } = action.meteor.subscribe;
    const parameters = params || [];

    if (Meteor.isServer && action.meteor.subscribe) {
      Meteor.subscribe(name, ...parameters);
      next({ type: actionTypeBuilder.ready(SUBSCRIPTIONS), name } );
      if (get) {
        return next({ type: action.type, meteor : { get } }).then(() => resolve());
      }
      return resolve();
    }


    const existing = sub && _.isEqual(sub.parameters, parameters);

    if (existing && sub.handle.ready()) {
      if (! sub.subscribedActions[action.type]) {
        sub.subscribedActions[action.type] = 'ready';
      }
      if (get) {
        return next({ type: action.type, meteor : { get } }).then(() => resolve());
      }
      return resolve();
    }

    if (sub && sub.handle.ready()) {
      sub.handle.stop();
    }


    next({ type: actionTypeBuilder.loading(SUBSCRIPTIONS), name });

    const handle = Meteor.subscribe(name, ...paramters, {
      onReady: () => {
        next({ type: actionTypeBuilder.ready(SUBSCRIPTIONS), name } );
        if (get) {
          return next({ type: action.type, meteor : { get } }).then(() => resolve());
        }
        return resolve();
      },
      onStop: (error) => {
        if (error) {
          next({ type: actionTypeBuilder.error(SUBSCRIPTIONS), name } );
          reject(error);
        }
        next({ type: actionTypeBuilder.stopped(SUBSCRIPTIONS), name } );
        delete subs[name];
      }
    });

    subs[name] = {
      subscribedActions: {[action.type]: 'ready'},
      parameters: _.clone(parameters),
      handle: handle
    };
  });
};
