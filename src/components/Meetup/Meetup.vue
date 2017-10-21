<template>
	<v-container>
		<v-layout row wrap xs12 sm6>
			<v-flex>
				<v-card>
					<div>
						<v-card-title>
							<h6 class='primary--text'>
								{{ meetup.title }}
							</h6>
							<template v-if='isMeetupOwner'>
								<v-spacer></v-spacer>
								<app-edit-meetup-details-dialog
								:meetup='meetup'></app-edit-meetup-details-dialog>
							</template>
						</v-card-title>
					</div>
					<div>
						<v-card-media :src='meetup.imageUrl' height='400px'>
						</v-card-media>
					</div>
					<div>
						<v-card-text class='info--text'>
							{{ meetup.date | dateFilter }} - {{ meetup.location }}
							<app-edit-meetup-date-dialog :meetup='meetup' v-if='isMeetupOwner'></app-edit-meetup-date-dialog>
							<app-edit-meetup-time-dialog :meetup='meetup' v-if='isMeetupOwner'></app-edit-meetup-time-dialog>
						</v-card-text>
						<v-card-text>
							{{ meetup.description }}
						</v-card-text>
					</div>
					<div>
						<v-card-actions>
							<v-spacer></v-spacer>
								<app-meetup-registration-dialog :meetupId='meetup.id'
								v-if='!isMeetupOwner && userIsAuthenticated'></app-meetup-registration-dialog>
						</v-card-actions>
					</div>
				</v-card>	
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      meetup () {
        return this.$store.getters.loadSingleMeetup(this.id)
      },
      isMeetupOwner () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.$store.getters.user.id === this.meetup.createdId
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== undefined && this.$store.getters.user !== null
      }
    }
  }
</script>