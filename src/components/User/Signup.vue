<template>
	<v-container>
		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<v-card>
          <v-alert error dismissible @click='onDismissed' :value="error.status">
            {{ error.textMessage }}
          </v-alert>
					<v-card-text>
						<form @submit.prevent='onSignUp'>
							<v-container>
								<v-layout>
									<v-flex>
										<v-text-field
											name='email'
											label='Email'
											id='email'
											v-model='email'
											type='email'
											required
										></v-text-field>
									</v-flex>
								</v-layout>
								<v-layout>
									<v-flex>
										<v-text-field
											name='password'
											label='Password'
											id='password'
											v-model='password'
											type='password'
											required
										></v-text-field>
									</v-flex>
								</v-layout>
								<v-layout>
									<v-flex>
										<v-text-field
											name='confirmPassword'
											label='Confirm Password'
											id='confirmPassword'
											v-model='confirmPassword'
											type='password'
                      :rules="[isPasswordConfirmed]"
										></v-text-field>
									</v-flex>
								</v-layout>
                <v-layout>
                  <v-flex>
                    <v-btn type='submit' :disabled='loading' :loading="loading">Sign Up
                             <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout> 
							</v-container>
						</form>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    computed: {
      isPasswordConfirmed () {
        return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
      },
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      onSignUp () {
        this.$store.dispatch('registerNewUser', {email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.dispatch('cleanError')
      }
    }
  }
</script>

<style>

</style>