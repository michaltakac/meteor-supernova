// loading user (compatible with react-router-ssr)
export function loadUserData() {
  return {
    type: USER_DATA,
    meteor: {
      subscribe: {
        name: 'userData',
        get: () => Meteor.users.findOne(Meteor.userId())
      }
    }
  }
}

// loading elements from collection
export function loadPosts() {
  return {
    type: POSTS,
    meteor: {
      subscribe: {
        name: 'posts',
        get: () => Posts.find().fetch()
      }
    }
  }
}

// dispatching Meteor method
export function signIn(email, password) {
  return {
    type: USER_SIGNIN,
    meteor: {
      call: {
        method: Meteor.loginWithPassword,
        params: [email, password]
      }
    }
  }
}

// dispatching Meteor call
export function checkUsername(username) {
  return {
    type: USER_CHECKUSERNAME,
    meteor: {
      call: {
        method: 'users.usernameIsFree',
        params: [{username}]
      }
    }
  }
}