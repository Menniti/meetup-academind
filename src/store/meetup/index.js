import * as firebase from 'firebase'

export default {
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
    ]
  },
  mutations: {
    createMeetup (state, payload) {
      state.meetups.push(payload)
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
    loadedStoredMeetups (state, payload) {
      state.meetups = payload
    }
  },
  actions: {
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
    }
  }
}
