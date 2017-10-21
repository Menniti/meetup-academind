<template>
	<v-container>
		<v-layout class='info' mt-2 v-for='meetup in Meetups' :key='meetup.id'>
			<v-flex xs12 sm6 pa-3>
				<v-card-media :src="meetup.imageUrl" height='180px'>
				</v-card-media>
			</v-flex>
			<v-flex xs7 sm8 md9 pt-2>
				<div>
					<v-card-title class='white--text' mb-0>
						<h5>
							{{ meetup.title }}
						</h5>
					</v-card-title>
					<v-card-title>
						<div>
							<h6> {{ meetup.data | dateFilter  }}</h6>
						</div>
					</v-card-title>
				</div>
				<div>
					<v-card-actions>
						<v-btn flat class='info' :to="'/meetups/' + meetup.id">
							<v-icon left >arrow_forward</v-icon>
							View Meetups
						</v-btn>
					</v-card-actions>
				</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
  export default {
    computed: {
      Meetups () {
        return this.$store.getters.loadedMeetups
      }
    }
  }
</script>

<style>

</style>