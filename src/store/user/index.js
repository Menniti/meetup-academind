import * as firebase from 'firebase'

export default {
  state: {
    user: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    createNewUser (state, payload) {
      state.user = payload
    },
    signInUser (state, payload) {
      state.user = payload
    },
    logoutUser (state) {
      state.user = null
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      if (!getters.user.fbKeys) {
        return
      }
      firebase.database().ref('/users/' + getters.user.id).child('/registration/').push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {
            fbKey: data.key,
            id: payload
          })
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      if (!getters.user.fbKeys) {
        return
      }
      firebase.database().ref('/users/' + getters.user.id + '/registration/').child(getters.user.fbKeys[payload])
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registration/').once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let swappedPairs = []
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swappedPairs[dataPairs[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('createNewUser', updatedUser)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    registerNewUser (context, payload) {
      context.commit('setLoading', true)
      context.commit('cleanError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            context.commit('setLoading', false)
            context.commit('createNewUser', newUser)
          },
        )
        .catch(
          error => {
            console.log(error)
            context.commit('setLoading', false)
            context.commit('setError', {
              status: true,
              textMessage: error.message
            })
          }
        )
    },
    signIn (context, payload) {
      context.commit('setLoading', true)
      context.commit('cleanError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const signInUser = {
              user: user.uid,
              // Meetups vazios, tomaremos conta disso depois
              registeredMeetups: [],
              fbKeys: {}
            }
            context.commit('setLoading', false)
            context.commit('signInUser', signInUser)
          }
        )
        .catch(
          error => {
            console.log(error)
            context.commit('setLoading', false)
            context.commit('setError', {
              status: true,
              textMessage: error.message
            })
          }
        )
    },
    autoSignIn (context, payload) {
      context.commit('signInUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    logout (context) {
      firebase.auth().signOut()
      context.commit('logoutUser')
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
