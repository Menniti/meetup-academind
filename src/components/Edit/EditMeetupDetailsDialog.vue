<template>
	    <v-dialog persistent width="350px" v-model='editDialog' >
	      <v-btn fab color="primary" slot="activator"  ><v-icon>edit</v-icon></v-btn>
	      <v-card>
	        <v-card-title>
	          <span class="headline">Edit Meetup</span>
	        </v-card-title>
	        <v-card-text>
	          <v-container grid-list-md>
	            <v-layout wrap>
	              <v-flex xs12>
	                <v-text-field
	                name='title'
	                label="Title"
	                id='title'
	                v-model='editTitle' 
	                required>
	                </v-text-field>
	              </v-flex>
	              <v-flex xs12>
	                <v-text-field
	                name='description' 
	                label="Description"
	                id='discription'
	                v-model='editDescription'
                  multi-line
	                required></v-text-field>
	              </v-flex>
	            </v-layout>
	          </v-container>
	          <small>*indicates required field</small>
	        </v-card-text>
	        <v-card-actions>
	          <v-spacer></v-spacer>
	          <v-btn color="blue darken-1" flat @click.native="editDialog = false">Close</v-btn>
	          <v-btn color="blue darken-1" flat @click.native="onSaveMeetupChanges">Save</v-btn>
	        </v-card-actions>
	      </v-card>
	    </v-dialog>
</template>

<script>
	export default {
  props: ['meetup'],
  data () {
    return {
      editTitle: this.meetup.title,
      editDescription: this.meetup.description,
      editDialog: false
    }
  },
  methods: {
    onSaveMeetupChanges () {
      if (this.editTitle.trim() === '' || this.editDescription.trim() === '') {
        return false
      }
      const editedMeetup = {
        title: this.editTitle,
        description: this.editDescription,
        id: this.meetup.id
      }
      this.editDialog = false
      this.$store.dispatch('updatedMeetup', editedMeetup)
    }
  }
}
</script>