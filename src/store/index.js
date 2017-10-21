import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    meetups: [
      {
        id: 'sao-paulo-meetup',
        title: 'Sao Paulo Awesome Meetups',
        description: 'Discover Awesome Meetups in the World',
        imageUrl: 'http://www.riomusicconference.com.br/wp-content/uploads/2015/05/Sao-Paulo-bridge.jpg',
        date: new Date()
      },
      {
        id: 'new-zealand-meetup',
        title: 'New Zealand Hyperledger Meetups',
        description: 'Discover Awesome Meetups in the World',
        imageUrl: 'https://www.cia.gov/library/publications/the-world-factbook/photo_gallery/nz/images/large/NZ_001_large.jpg',
        date: new Date()
      }
    ],
    user: null,
    error: {
      status: false,
      textMessage: ''
    },
    loading: false
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
    createMeetup (state, payload) {
      state.meetups.push(payload)
    },
    createNewUser (state, payload) {
      state.user = payload
    },
    signInUser (state, payload) {
      state.user = payload
    },
    logoutUser (state) {
      state.user = null
    },
    updateMeetup (state, payload) {
      const meetup = state.meetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    },
    cleanError (state) {
      state.error = {
        status: false,
        textMessage: ''
      }
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    loadedStoredMeetups (state, payload) {
      state.meetups = payload
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
    loadStorageMeetups (context) {
      context.commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then(data => {
          const fetchedMeetups = []
          const obj = data.val()
          for (let key in obj) {
            fetchedMeetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              location: obj[key].location,
              date: obj[key].date,
              createdId: obj[key].id
            })
          }
          context.commit('loadedStoredMeetups', fetchedMeetups)
          context.commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          context.commit('setLoading', false)
        })
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        // removing the imageUrl once the payload has not receive imageUrl
        // imageUrl: payload.imageUrl
        description: payload.description,
        date: payload.date.toISOString(),
        id: getters.user.id
      }
      let imageUrl
      let key
      // storage the objet meetup into firebase/meetups
      firebase.database().ref('meetups').push(meetup)
        // then a meetup data.key will return
        .then(data => {
          key = data.key
          return key
        })
        // got the the key and the extention of the file and upload the IMAGE in the firebase.STORAGE
        .then(meetupKey => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('meetups/' + meetupKey + '.' + ext).put(payload.image)
        })
        // get back the URL of the IMAGE in storage and put that in the meetup objet previusly pushed
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
        })
        // now push this information inside of vuex to track
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch(error => {
          console.log(error)
          commit('setError', error)
        })
    },
    updatedMeetup ({commit}, payload) {
      commit('cleanError')
      commit('setLoading')
      const editedMeetup = {}
      if (payload.date) {
        editedMeetup.date = payload.date
      }
      if (payload.title) {
        editedMeetup.title = payload.title
      }
      if (payload.description) {
        editedMeetup.description = payload.description
      }
      firebase.database().ref('meetups').child(payload.id).update(editedMeetup)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch((error) => {
          console.log(error)
          commit('setError', error)
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
    },
    cleanError (context) {
      context.commit('cleanError')
    },
    setError (context, payload) {
      const setError = {
        status: payload.status,
        textMessage: payload.textMessage
      }
      context.commit('setError', setError)
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.meetups.sort((meetupA, meetupB) => {
        return meetupA.data < meetupB.data
      })
    },
    featureCaroselMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadSingleMeetup (state, getters) {
      return (meetupId) => {
        return getters.loadedMeetups.find(meetup => {
          return meetup.id === meetupId
        })
      }
    },
    user (state) {
      return state.user
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
})
