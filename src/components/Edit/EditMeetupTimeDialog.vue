<template>
	    <v-dialog persistent width="290px" v-model='editDialog' >
	      <v-btn accent color="primary" slot="activator">Edit Time</v-btn>
	      <v-card>
	        <v-card-title>
	          <span class="headline">Edit Meetup Time</span>
	        </v-card-title>
      			<v-time-picker class='text-xs-center' v-model="editableTime" format='24hr'></v-time-picker>
	        <v-card-actions>
          <v-layout>
              <v-flex>
                <v-btn left color="blue darken-1" flat @click.native="editDialog = false">Close</v-btn>
              </v-flex>
              <v-flex>
                <v-btn left color="blue darken-1" flat @click.native="onSaveMeetupChanges">Save</v-btn>
              </v-flex>
          </v-layout>
	        </v-card-actions>
	      </v-card>
	    </v-dialog>
</template>

<script>
	export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editableTime: null
    }
  },
  methods: {
    onSaveMeetupChanges () {
      const newDate = new Date(this.meetup.date)
      const hours = this.editableTime.match(/^(\d+)/)[1]
      const minutes = this.editableTime.match(/:(\d+)/)[1]
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      this.$store.dispatch('updatedMeetup', {
        id: this.meetup.id,
        date: newDate
      })
      this.editDialog = false
    }
  },
  create () {
    this.editableTime = new Date(this.meetup.date).toTimeString()
  }
}
</script>