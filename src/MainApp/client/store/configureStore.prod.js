import rootReducer from '../reducers';
import createLogger from 'redux-logger';
import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import meteorDatasource from '../middlewares/meteor-datasource';
import meteorSubscription from '../middlewares/meteor-subscription';
import meteorMethod from '../middlewares/meteor-method';
import { meteorInsert, meteorUpdate, meteorRemove } from '../middlewares/meteor-crud';
import { newSuccessNotification, newErrorNotification } from '../actions/notifications';


export default function configureStore(history, initialState) {

  const middlewares = [
    thunkMiddleware,
    meteorSubscription,
    meteorDatasource,
    meteorMethod(newSuccessNotification, newErrorNotification),
    meteorInsert(newSuccessNotification, newErrorNotification),
    meteorUpdate(newSuccessNotification, newErrorNotification),
    meteorRemove(newSuccessNotification, newErrorNotification),
  ]

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares)
    )
  )

  return store;
}
