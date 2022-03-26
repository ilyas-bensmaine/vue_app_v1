<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item v-if="auth">
          <v-list-item-action> 
            <v-avatar color="indigo">
              <v-icon dark> mdi-account-circle </v-icon>
            </v-avatar>
          </v-list-item-action>
          <v-list-item-content>
            
            <v-list-item-title>{{ logged_user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ logged_user.phone }}</v-list-item-subtitle>
          </v-list-item-content>

          
        </v-list-item>

        <v-list-item link :to="{ name: 'accueil' }">
          <v-list-item-action>
            <v-icon>mdi-home </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{$t('Accueil')}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        
        <v-list-item v-if="auth" link :to="{name: 'my-demandes' , params : {id : logged_user.id } }">
          <v-list-item-action>
            <v-icon>mdi-file-document-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mes Demandes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="auth" link :to="{ name: 'demandes-vues' }">
          <v-list-item-action>
            <v-icon>mdi-file-eye</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Demandes vues </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="auth" link :to="{ name: 'demandes-aime' }">
          <v-list-item-action>
            <v-icon>mdi-heart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Demandes aimées</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="auth" @click="logout">
          <v-list-item-action>
            <v-btn v-if="auth" icon><v-icon>mdi-logout</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-title>Se déconnecter</v-list-item-title>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-title>
            <login @RefreshUser="RefreshU" />
            <register @RefreshUser="RefreshU" />
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-switch v-model="$vuetify.theme.dark" label="dark"></v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <demand-modal></demand-modal>
      <v-menu :close-on-content-click="false" :nudge-width="200" offset-x left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mx-3" v-bind="attrs" v-on="on" icon>
            <v-badge
              v-if="notifications"
              :content="notifications_count"
              :value="notifications_count"
              color="red"
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <notifications
          :notifications="notifications"
          :key="notificationKey"
        ></notifications>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <span>© {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { HTTP } from "./http-constants";
import demandModal from "./components/demandModal.vue";
import login from "./components/login.vue";
import register from "./components/register.vue";
import Notifications from "./components/notifications.vue";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: { demandModal, Notifications, login, register },
  props: {
    Notificationssource: String,
  },
  data: () => ({
    drawer: null,
    notifications: null,
    notificationKey: 0,
    menu: false,
  }),
  mounted() {
    this.$store.dispatch("loadWilayas");
    this.$store.dispatch("loadEtats");
  },
  methods: {
    ...mapActions({
      singOut: "auth/logout",
    }),

    forceRerenderNotifications() {
      this.notificationKey += 1;
    },
    getNotifications() {
      HTTP.get("api/notification")
        .then((response) => {
          this.notifications = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async logout() {
      await HTTP.post("api/logout").then(() => {
        //todo toasted
        this.singOut();
        this.menu = false;
        this.$router.push({ name: "accueil" });

        this.$toasted.info("Vous etes déconnectés ", {
          theme: "bubble",
          position: "top-center",
          duration: 5000,
          keepOnHover: true,
        });
      });
    },
    RefreshU() {
      this.logged_user = this.$store.state.auth.user;
      this.auth = this.$store.state.auth.authenticated;
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    logged_user() {
      return this.$store.state.auth.user;
    },
    notifications_count() {
      return this.notifications.length;
    },
  },
  created() {
    this.$store.dispatch("auth/login");
    this.$vuetify.theme.dark = true;
    this.getNotifications();

     this.$echo.private('demands_channel_'+ this.logged_user.id).listen('NewDemandeAdded', (payload) => {
             let demande = payload["data"]["demande"]
             this.notifications.unshift({"demande" : demande ,
                                          'type' : demande.types[0] }
                                        );
             this.forceRerenderNotifications();
        });
      
     this.$echo.private('reponses_channel_'+ this.logged_user.id).listen('NewReponseAdded', (e) => {
           console.log(e)
        });
      


    
    // this.$echo
    //   .private("App.Models.User." + this.$store.state.auth.user.id)
    //   .notification((payload) => {
    //     console.log("payload");
    //     console.log(payload.type);
    //     // console.log("noties");
    //     // console.log(this.notifications[0]);
    //     // this.notifications.unshift(payload["data"]);
    //     // this.$toasted.show("une demande a été ajoutée !!", {
    //     //     theme: "bubble",
    //     //     position: "top-center",
    //     //     duration: 5000,
    //     //     keepOnHover: true,
    //     //     action: [
    //     //         {
    //     //             text: 'Cancel',
    //     //             onClick: (e, toastObject) => {
    //     //                 toastObject.goAway(0);
    //     //             }
    //     //         }
    //     //     ]
    //     // });
    //     this.forceRerenderNotifications();
    //   });

    // this.$echo
    //   .channel("App.Models.User." + this.logged_user.id)
    //   .listen("BroadcastNotificationCreated", (payload) => {
    //     console.log("payload");
    //     console.log(payload["data"]);
    //     console.log("noties");
    //     console.log(this.notifications[0]);
    //     this.notifications.unshift(payload["data"]);
    //     this.$toasted.show("Quelqu'un a repondu sur votre demande", {
    //       theme: "bubble",
    //       position: "top-center",
    //       duration: 5000,
    //       keepOnHover: true,
    //       action: [
    //         {
    //           text: "Cancel",
    //           onClick: (e, toastObject) => {
    //             toastObject.goAway(0);
    //           },
    //         },
    //       ],
    //     });
    //     this.forceRerenderNotifications();
    //   });
  },
  destroyed() {
    this.singOut();
  },
};
</script>

