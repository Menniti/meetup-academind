<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-tile v-for="item in menuItens" :key="item.title" v-bind:to="item.link">
          <v-list-tile-action>
              <v-icon>
                {{ item.icon }}
              </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title }}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if='userIsAuthenticated'>
          <v-list-tile-action>
            <v-icon>
              exit_to_app
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content @click='onLogout' style='cursor: pointer'>
            Logout
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class='primary'>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
      
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          DevMeetup
        </router-link>
      </v-toolbar-title>
      <!-- Espassador da toolbar, jogando um para cada lado -->
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <!-- flat e o tipo de botao do ViewMeetup -->

          <v-btn flat v-for='item in menuItens' :key="item.title" :to="item.link">
            <!-- left, ira deixar o icon para o lado esquerdo dentro do botao view meetup -->
            <v-icon left>{{ item.icon }}</v-icon>
              {{ item.title }}           
          </v-btn>
          <v-btn flat @click='onLogout' v-if='userIsAuthenticated'>
              <v-icon left>exit_to_app</v-icon>
                Logout
          </v-btn> 
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <!-- Aqui fica o conteudo da pagina -->
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false
      }
    },
    computed: {
      menuItens () {
        let menuItens = [
          { icon: 'face',
            title: 'Sign up',
            link: '/signup'},
          { icon: 'lock_open',
            title: 'Sign in',
            link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItens = [
            { icon: 'supervisor_account',
              title: 'View Meetups',
              link: '/meetups'},
            { icon: 'room',
              title: 'Organize Meetup',
              link: '/meetups/new'},
            { icon: 'person',
              title: 'Profile',
              link: '/profile'}
          ]
        }
        return menuItens
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== undefined && this.$store.getters.user !== null
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>
