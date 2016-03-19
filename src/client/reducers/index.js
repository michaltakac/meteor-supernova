import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import app from './app';
import auth from './auth';
import coachees from './coachees';
import meals from './meals';
import mealTemplates from './mealTemplates';
import notifications from './notifications';
import subscriptions from './subscriptions';

const rootReducer = combineReducers({
  app,
  auth,
  coachees,
  meals,
  mealTemplates,
  notifications,
  subscriptions,
  routing
});

export default rootReducer;
