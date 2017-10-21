<template>
	<v-container>
		<v-layout row wrap>
			<v-flex xs12 sm6 offset-xs1 offset-sm3 mt-4>
        <v-layout>
            <v-flex class='primary--text'>
              <h3>Create New Meetup</h3>
            </v-flex>
        </v-layout>
				<form @submit.prevent='registerNewMeetup'>
					<v-layout>
						<v-flex>
							<v-text-field
								name='title'
								label='Title'
								id='title'
                v-model='title'
								required
							></v-text-field>
						</v-flex>
					</v-layout>
					<v-layout>
						<v-flex>
							<v-text-field
								name='location'
								label='Location'
								id='location'
                v-model='location'
								required
							></v-text-field>
						</v-flex>
					</v-layout>
					<v-layout>
						<v-flex>
              <input type='file' 
              ref='uploadPickedFile' 
              v-show='false' 
              accept="image/*"
              @change='onFilePicked'>
              </input>
              <v-btn @click='onPickFile'>Upload File</v-btn>
							<!-- 
                This code is to put the IMG URL
                <v-text-field
								name='imageUrl'
								label='Image Url'
								id='image-url'
                v-model='imageUrl'
								required
							></v-text-field> -->
						</v-flex>
					</v-layout>
					<v-layout>
						<v-flex>
							<img :src='imageUrl' height="200px">
						</v-flex>
					</v-layout>
					<v-layout>
						<v-flex>
							<v-text-field
								name='description'
								label='description'
								id='description'
                v-model='description'
								required
								textarea
							></v-text-field>
						</v-flex>
					</v-layout>
          <v-layout>
            <v-flex md12 lg4>
              <v-date-picker
                v-model="datePicker"
              ></v-date-picker>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex md12 lg4 lg-offset8>
              <v-time-picker v-model="timePicker" format="24hr"></v-time-picker>
            </v-flex>
          </v-layout>
					<v-layout right>
						<v-flex>
							<v-btn class='primary' type='submit' :disabled='!isValidatedForm'>Register New Meetup</v-btn>
						</v-flex>
					</v-layout>
				</form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        location: '',
        imageUrl: '',
        description: '',
        datePicker: new Date(),
        timePicker: new Date(),
        image: null
      }
    },
    computed: {
      isValidatedForm () {
        return this.title !== '' && this.location !== '' && this.imageUrl !== '' && this.description !== ''
      },
      submitDataFormat () {
        const date = new Date(this.datePicker)
        if (typeof this.timePicker === 'string') {
          const hours = this.timePicker.match(/^(\d+)/)[1]
          const minutes = this.timePicker.match(/:(\d+)/)[1]
          date.setHours(hours)
          date.setMinutes(minutes)
        } else {
          date.setHours(this.timePicker.getHours())
          date.setMinutes(this.timePicker.getMinutes())
        }
        console.log(date.getDate())
        return date
      }
    },
    methods: {
      registerNewMeetup () {
        if (!this.isValidatedForm) return
        if (!this.image) {
          return
        }
        const meetupData = {
          title: this.title,
          location: this.location,
          // We are not gonna upload a imageUrl, because it will storage a BIG string that represents the image, instaead we will use image, which has been changed to BINARY data
          // imageUrl: this.imageUrl,
          image: this.image,
          description: this.description,
          date: this.submitDataFormat
        }
        this.$store.dispatch('createMeetup', meetupData)
        this.$router.push('/meetups')
      },
      onPickFile () {
        this.$refs.uploadPickedFile.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        const file = files[0]
        // check if the file is valid using extention name
        if (file.name.lastIndexOf('.') <= 0) {
          return alert('Please Add a valid File')
        }
        // create new instance of FileReader
        const fileReader = new FileReader()
        // convert the file
        fileReader.readAsDataURL(file)
        // add event listener to return the result of readAsDataURL
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        this.image = file
      }
    }
  }
</script> 

<style>

</style>