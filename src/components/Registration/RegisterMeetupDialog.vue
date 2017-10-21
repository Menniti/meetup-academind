<template>
	    <v-dialog persistent v-model='editDialog'>
	      <v-btn accent class='primary' slot="activator">{{ isUserRegistrated ? 'Unregister' : 'Register' }}</v-btn>
	      <v-card>
	        <v-card-title v-if='isUserRegistrated'>
	           Unregister from Meetup ?
	        </v-card-title>
          <v-card-title v-else>
             Register for Meetup ?
          </v-card-title>
          <v-card-text>
            You are always able to undone this action
          </v-card-text>
	        <v-card-actions>
          <v-layout>
              <v-flex>
                <v-btn left class="red--text darken-1" flat @click="editDialog = false">Close</v-btn>
              </v-flex>
              <v-flex>
                <v-btn left class="green--text darken-1" flat @click="onAgree">Save</v-btn>
              </v-flex>
          </v-layout>
	        </v-card-actions>
	      </v-card>
	    </v-dialog>
</template>

<script>
	export default {
  props: ['meetupId'],
  data () {
    return {
      editDialog: false
    }
  },
  computed: {
    isUserRegistrated () {
      return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
        return meetupId === this.meetupId
      }) >= 0
    }
  },
  methods: {
    onAgree () {
      if (this.isUserRegistrated) {
        console.log('teste')
        this.editDialog = false
        console.log(this.meetupId)
        this.$store.dispatch('unregisterUserFromMeetup', this.meetupId)
      } else {
        console.log('teste2')
        this.editDialog = false
        console.log(this.meetupId)
        this.$store.dispatch('registerUserForMeetup', this.meetupId)
      }
    }
  }
}
</script>