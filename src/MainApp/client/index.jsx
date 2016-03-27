/* global Accounts, Meteor */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
//import { Provider } from 'react-redux';
import { Router } from 'react-router';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import { switchLocale } from './actions/app';
import { loadUser } from './actions/auth';
import Root from './containers/Root';

// Tether is required by bootstrap components such as tooltips and popovers
// It must be loaded first and exposed globally (we use the expose-loader for webpack)
require('expose?Tether!tether');

// Requiring bootstrap here ensure we can use javascript based components such as tooltips and popovers
require('bootstrap');

import './styles/main.scss';

const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store)

// Dispatch the loadUser action immediatly so that the current user is available
// in the global state reactivly
store.dispatch(loadUser());

// Dispatch the switchLocale action immediatly if the user language isn't the default one
const locale = navigator.language || navigator.browserLanguage;

if (locale !== 'en') {
  store.dispatch(switchLocale(locale));
}

// We must wait for Meteor to be ready before trying to render React otherwise,
// our main template from ./meteor.html would not be available
Meteor.startup(() => {
  moment.locale(locale);

  render(
    <Root store={store} history={history} />,
    document.getElementById('root')
  );
});
