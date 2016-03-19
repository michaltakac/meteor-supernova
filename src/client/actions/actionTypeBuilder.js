// This function will be extracted to an npm package later
export function actionTypeBuilder(prefix) {
  return {
    type: actionType => `${prefix}/${actionType}`,
    loading: actionType => `${actionType}/loading`,
    ready: actionType => `${actionType}/ready`,
    stopped: actionType => `${actionType}/stopped`,
    changed: actionType => `${actionType}/changed`,
    error: actionType => `${actionType}/error`,
    success: actionType => `${actionType}/success`
  };
}

export default actionTypeBuilder('@my-app');
