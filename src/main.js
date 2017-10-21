import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/Date'
import EditMeetupDetailsDialog from './components/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './components/Edit/EditMeetupDateDialog'
import EditMeetupTimeDialog from './components/Edit/EditMeetupTimeDialog'
import RegistrationMeetupDialog from './components/Registration/RegisterMeetupDialog'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('dateFilter', DateFilter)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-registration-dialog', RegistrationMeetupDialog)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
  // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyCq0hUZ6wjd7jJ0CleusLmxSqBMS4sYTjE',
      authDomain: 'youtube-devmeetup-8ef19.firebaseapp.com',
      databaseURL: 'https://youtube-devmeetup-8ef19.firebaseio.com',
      projectId: 'youtube-devmeetup-8ef19',
      storageBucket: 'gs://youtube-devmeetup-8ef19.appspot.com',
      messagingSenderId: '34176468315'
    }
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData', user)
      }
      this.$store.dispatch('loadStorageMeetups')
    })
  }
})
