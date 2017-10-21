<template>
	    <v-dialog persistent width="290px" v-model='editDialog' >
	      <v-btn accent color="primary" slot="activator">Edit Date</v-btn>
	      <v-card>
	        <v-card-title>
	          <span class="headline">Edit Meetup Date</span>
	        </v-card-title>
      			<v-date-picker class='text-xs-center' v-model="editableDate"></v-date-picker>
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
      editableDate: null
    }
  },
  methods: {
    onSaveMeetupChanges () {
      const newDate = new Date(this.meetup.date)
      const newDay = new Date(this.editableDate).getUTCDate()
      const newMonth = new Date(this.editableDate).getUTCMonth()
      const newYear = new Date(this.editableDate).getUTCFullYear()
      newDate.setUTCDate(newDay)
      newDate.setUTCMonth(newMonth)
      newDate.setUTCFullYear(newYear)
      this.$store.dispatch('updatedMeetup', {
        id: this.meetup.id,
        date: newDate
      })
      this.editDialog = false
    }
  },
  create () {
    this.editableDate = new Date(this.meetup.date)
  }
}
</script>