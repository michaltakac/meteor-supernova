import actionTypeBuilder from './actionTypeBuilder';

export const SUBSCRIPTIONS = actionTypeBuilder.type('SUBSCRIPTIONS');

export function subscribeTo(name, type, ...params) {
  return {
    type: type,
    meteor: {
      subscribe: {
        name: name,
        params: params
      }
    }
  }
}
