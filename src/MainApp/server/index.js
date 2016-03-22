/* global AccountsEmail, Meteor, Roles, ServiceConfiguration */
import registerDishSecurity from './security/dishes';
import registerMealSecurity from './security/meals';
import registerMealTemplateSecurity from './security/mealTemplates';
import registerUserSecurity from './security/users';

import registerAuthPublications from './publications/auth';
import registerCoacheesPublications from './publications/coachees';
import registerMealPublications from './publications/meals';
import registerMealTemplatePublications from './publications/mealTemplates';

import registerAuthHooks from './hooks/accounts';
import registerDishHooks from './hooks/dishes';
import registerMealHooks from './hooks/meals';

import copyDishToMealFactory from './methods/meals/copyDishToMeal';
import checkUserHasAccessToUserPlanningFactory from './methods/user/checkUserHasAccessToUserPlanning';
import createOAuthServiceConfigurationFactory from './methods/createOAuthServiceConfiguration';
import createMealFromTemplateFactory from './methods/meals/createMealFromTemplate';
import createMealTemplateFactory from './methods/meals/createMealTemplate';
import getUserDataFactory from './methods/user/getUserData';
import incrementDishesPositionFactory from './methods/meals/incrementDishesPosition';
import initializeAccountFromInviteFactory from './methods/user/initializeAccountFromInvite';
import inviteCoachFactory from './methods/invites/inviteCoach';
import inviteCoacheeFactory from './methods/invites/inviteCoachee';
import moveDishToMealFactory from './methods/meals/moveDishToMeal';
import sendCoachInvitationFactory from './methods/invites/sendCoachInvitation';
import sendCoacheeInvitationFactory from './methods/invites/sendCoacheeInvitation';
import setAccountRoleFactory from './methods/user/setAccountRole';
import setUserCoachFactory from './methods/user/setUserCoach';
import updateMealDishesFactory from './methods/meals/updateMealDishes';

import registerDefaultsMealTemplates from './fixtures/registerDefaultsMealTemplates';

import { Dishes } from 'MainApp/collections/dishes';
import { Invites } from 'MainApp/collections/invites';
import { Meals } from 'MainApp/collections/meals';
import { MealTemplates } from 'MainApp/collections/mealTemplates';

import './security/cors'

const setAccountRole = setAccountRoleFactory(Roles);
const incrementDishesPosition = incrementDishesPositionFactory(Dishes);
const updateMealDishes = updateMealDishesFactory(Dishes, Meals);

registerDishSecurity(Dishes);
registerMealSecurity(Meals);
registerMealTemplateSecurity(MealTemplates);
registerUserSecurity(Meteor.users);

registerAuthHooks(MealTemplates, Invites, AccountsEmail.extract, setUserCoachFactory(Meteor.users));
registerDishHooks(Dishes, updateMealDishes);
registerMealHooks(Meals, Dishes);

registerAuthPublications(getUserDataFactory(Meteor.users));
registerCoacheesPublications(Meteor.users);
registerMealPublications(Meals, checkUserHasAccessToUserPlanningFactory(Meteor.users));
registerMealTemplatePublications(MealTemplates);

Meteor.methods({
  createMealFromTemplate: createMealFromTemplateFactory(Meals, Dishes, MealTemplates),
  createMealTemplate: createMealTemplateFactory(Meals, Dishes, MealTemplates),
  copyDishToMeal: copyDishToMealFactory(Dishes, incrementDishesPosition, updateMealDishes),
  moveDishToMeal: moveDishToMealFactory(Dishes, incrementDishesPosition, updateMealDishes),
  initializeAccountFromInvite: function initializeAccountFromInvite(token) {
    return initializeAccountFromInviteFactory(Invites, setAccountRole, setUserCoachFactory(Meteor.users))(this.userId, token);
  },
  inviteCoach: function inviteCoach(email) {
    return inviteCoachFactory(Invites, sendCoachInvitationFactory(Meteor.users))(this.userId, email);
  },
  inviteCoachee: function inviteCoachee(email) {
    return inviteCoacheeFactory(Invites, sendCoacheeInvitationFactory(Meteor.users))(this.userId, email);
  },
  setAccountAsCoach: function setAccountAsCoach() {
    return setAccountRole(this.userId, 'coach');
  },
  setAccountAsCoachee: function setAccountAsCoachee() {
    return setAccountRole(this.userId, 'coachee');
  },
});

Meteor.startup(() => {
  const createOAuthServiceConfiguration = createOAuthServiceConfigurationFactory(ServiceConfiguration.configurations);

  if (Meteor.settings.google) {
    if (!Meteor.settings.google.clientId) {
      console.log('Invalid clientId for google oauth in settings');
    }

    if (!Meteor.settings.google.secret) {
      console.log('Invalid secret for google oauth in settings');
    }

    createOAuthServiceConfiguration('google', {
      clientId: Meteor.settings.google.clientId,
      secret: Meteor.settings.google.secret,
    });
  }

  if (Meteor.settings.facebook) {
    if (!Meteor.settings.facebook.clientId) {
      console.log('Invalid clientId for facebook oauth in settings');
    }

    if (!Meteor.settings.facebook.secret) {
      console.log('Invalid secret for facebook oauth in settings');
    }

    createOAuthServiceConfiguration('facebook', {
      appId: Meteor.settings.facebook.appId,
      secret: Meteor.settings.facebook.secret,
    });
  }

  registerDefaultsMealTemplates(MealTemplates, Meteor.users);
});
