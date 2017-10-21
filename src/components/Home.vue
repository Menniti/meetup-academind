<template>
	<v-container>
		<v-layout row wrap class="mb-2">
			<v-flex xs12 sm6 class="text-sm-right">
				<v-btn large to="/meetups" class="info">Explorer Meetups</v-btn>
			</v-flex>
			<v-flex xs12 sm6 class="text-sm-left">
				<v-btn large to="/meetups/new" class="info">Organize Meetups</v-btn>
			</v-flex>
		</v-layout>
		<v-layout>
			<v-flex xs12 class="text-xs-center">
				<v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="purple" v-if='loading'></v-progress-circular>
			</v-flex>
		</v-layout>
		<v-layout row wrap v-if='!loading'>
			<v-flex>
				<v-carousel>
					<v-carousel-item v-for="item in meetups" :src="item.imageUrl" :key="item.id" 
					style='cursor: pointer'
					@click='onLoadMeetup(item.id)'>
					<div class='title'>
						{{item.title}}
					</div>
					</v-carousel-item>
				</v-carousel>
			</v-flex>
		</v-layout>
		<v-layout row wrap class="mt-2">
			<v-flex xs12 class="text-sm-center">
				<h5>Join in our awesome meetups</h5>
			</v-flex>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
  computed: {
    meetups () {
      return this.$store.getters.featureCaroselMeetups
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onLoadMeetup (id) {
      this.$router.push('/meetups/' + id)
    }
  }
}
</script>

<style scoped>
	.title {
		position: absolute;
		bottom: 50px;
		background-color: rgba(0,0,0,0.5);
		color:white;
		padding: 10px;
	}
</style>