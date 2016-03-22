import actionTypeBuilder from '../actions/actionTypeBuilder';
import { SUBSCRIPTIONS } from '../actions/subscriptions';

const initialState = {};

export default function(state = initialState, action) {
  const { type, name } = action;

  switch (type) {
    case actionTypeBuilder.ready(SUBSCRIPTIONS):
      return {...state, [name]: {ready: true} };

    case actionTypeBuilder.loading(SUBSCRIPTIONS):
      return {...state, [name]: {ready: false, loading: true} };

    case actionTypeBuilder.stopped(SUBSCRIPTIONS):
      return {...state, [name]: {ready: false, loading: false} };

    case actionTypeBuilder.error(SUBSCRIPTIONS):
      return {...state, [name]: {ready: false, error: true, loading: false} };

    default:
      return state;
  }
}