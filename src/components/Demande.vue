<template>
  <div>
    <v-card class="pa-2 mx-auto elevation-5" outlined>
      <v-card-title>Demande n° : #{{ demande.demande.id }}</v-card-title>
      <v-card-text>
        <v-row align-content="center">
          <v-col md="8" lg="8" xl="8" cols="12">
              <v-chip v-if="demande.type" small close-icon="mdi-close-outline" color="warning"
                >{{ demande.type.nom_fr }}
              </v-chip>
              <v-chip-group column>
              <v-chip
                small
                close-icon="mdi-close-outline"
                color="warning"
                outlined
                v-for="category in demande.categories" :key="'cat'+category.id"

                >{{ category.nom_fr }}
              </v-chip>
              <!-- </v-chip-group>
              <v-chip-group column> -->
              <v-chip
              v-for="marque in demande.marques" :key="'mar'+marque.id"
              
                small
                close-icon="mdi-close-outline"
                color="success"
                outlined
                >{{ marque.nom_fr }}
              </v-chip>

              <v-chip
                small
                v-for="modele in demande.modeles" :key="'mar'+modele.id"
                 
                close-icon="mdi-close-outline"
                color="success"
                outlined
                >{{ modele.nom_fr }}
              </v-chip>
              </v-chip-group >
            <v-chip-group>
              <v-chip small color="success" >
                <v-icon x-small>mdi-google-maps</v-icon>
                {{ wilaya.code + " " + wilaya.name }}
              </v-chip>
              <v-chip color="info" small>
                <v-icon x-small>mdi-</v-icon>
                {{ etat.nom_fr }}
              </v-chip>
            </v-chip-group>
            <br />
            <div v-if="demande.demande.note">
              <v-icon small>mdi-note</v-icon>
              {{ demande.demande.note }}
            </div>
          </v-col>
          <v-col md="4" lg="4" xl="4" cols="12" >
            <v-img
              max-height="300"
              max-width="300"
              loading
              loading-text="loading..."
              :src="demande.image"
            ></v-img>
          </v-col>
          <v-btn class="mx-8" v-if="$store.state.auth.authenticated" :key="fav" :class="fav ? 'red--text' : ''" icon @click="ToggleSaved">
            <v-icon>mdi-heart</v-icon> {{demande.likes}} 
          </v-btn>
          <v-btn v-if="!detail" icon :to="'/demande/' + demande.demande.id">
            <v-icon>mdi-page-next-outline</v-icon>
          </v-btn>
        </v-row>
      </v-card-text>
    
    <v-expansion-panels >
      <v-expansion-panel>
        <v-expansion-panel-header v-if="owner" @click="show_detail = true">
          Afficher les Offres</v-expansion-panel-header
        >
        <v-expansion-panel-header v-else @click="show_detail = true">
          Proposer Une pièce</v-expansion-panel-header
        >
        <offers-list 
          v-if="owner && show_detail"
          :demande_id="demande.demande.id"
        ></offers-list>
        <offre
          v-if="!owner && show_detail"
          :demande_id="demande.demande.id"
          :user_id="demande.demande.user_id"      
        ></offre>
      </v-expansion-panel>
    </v-expansion-panels>
    </v-card>

    
  </div>
</template>
<script>
import { HTTP } from '../http-constants';
import OffersList from "./OffersList.vue";
import offre from "./offre.vue";

export default {
  components: { offre, OffersList },
  props: ["demande" , "detail"],
   data: () => ({
   fav : false,
   show_detail : false
   }),
  computed: {
    
    owner() {

      return this.demande.demande.user_id === this.$store.state.auth.user.id ;
    },
    wilayas() {
      return this.$store.state.wilayas;
    },
    etats() {
      return this.$store.state.etats;
    },

    wilaya() {
      return this.$store.state.wilayas.find(
        (item) => item.id == this.demande.demande.wilaya_id
      );
    },
    etat() {
      return this.$store.state.etats.find(
        (item) => item.id == this.demande.demande.etat_id
      );
    },
  
  },
  methods: {
   ToggleSaved(){
     HTTP.get('api/demande/'+this.demande.demande.id+'/ToggleSaved')
     .then((response)=> {
       console.log(response.data)
       this.fav           = response.data.is_saved;
       this.demande.likes = response.data.likes
     }).catch(()=>{
       console.log('error')
     })
   },
  },
  created(){
    this.fav = this.demande.is_saved
  }
};
</script>
