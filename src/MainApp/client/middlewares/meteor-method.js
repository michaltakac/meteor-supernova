/* global Meteor */
import Promise from 'bluebird';
import actionTypeBuilder from '../actions/actionTypeBuilder';

export default store => next => action => {
  if (!action.meteor || !action.meteor.call) {
    return next(action);
  }

  const { method, params } = action.meteor.call;
  const parameters = params || [];

  const meteorMethod = typeof method === 'string' ? Meteor.call : method;

  if (typeof method === 'string') {
    parameters.unshift(method);
  }

  return new Promise((resolve, reject) => {

    next({ type: actionTypeBuilder.loading(action.type) });

    meteorMethod(...parameters, (error, result) => {
      if (error) {
        next({ type: actionTypeBuilder.error(action.type), error });
        return reject(error);
      }

      next({ type: actionTypeBuilder.success(action.type) });
      return resolve(result);
    });
  });
};
