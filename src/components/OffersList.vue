<template>
  <div>
    <v-expansion-panel-content>
      <v-dialog v-model="dialog" width="800"  >
        <v-card>
          <v-card-title> Détail de l'offre </v-card-title>

          <v-card-text>
             <v-row>
              <v-col cols="6" >
            Wilaya : <v-chip small>{{ offer.wilaya }}</v-chip>
            <br>
            <br>
            Etat   : <v-chip small>{{ offer.etat }}</v-chip>
            <br>
            <br>
            Description : {{offer.note}}
            <br>
            Telephone :         
           <v-chip small> <a :href="'tel:'+offer.phone">{{offer.phone}}</a></v-chip>
              </v-col>

        <v-col cols="6">
          <v-img max-width="200" v-if="offer.image" :src="offer.image"></v-img>
        </v-col>
             </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table :loading="loading"
        :headers="headers"
        :items="offers"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.id" >
              <td @click="showDetail(item)">{{ item.reponse.wilaya_id }}</td>
              <td @click="showDetail(item)">{{ item.etat }}</td>
              <td @click="showDetail(item)">{{ item.reponse.prix_offert }}</td>
              <td><v-chip small> <a :href="'tel:'+item.phone">{{item.phone}}</a></v-chip></td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-expansion-panel-content>
  </div>
</template>
<script>
import { HTTP } from "../http-constants";
export default {
  props: ["demande_id"],
  data: () => ({
    dialog: false,
    loading: false,
    headers: [
      { text: "Wilaya", value: "reponse.wilaya_id" },
      { text: "Etat", value: "reponse.nom_etat" },
      { text: "Prix", value: "reponse.prix_offert" },
      { text: "num telephone"},
    ],
    offers: [],
    offer: {
      wilaya: "",
      etat: "",
      Prix: "",
      note : "",
      phone: "",
      image : "",
    },
  }),
  methods: {
    getOffers() {
      this.loading = true;
      HTTP.get("api/reponse/" + this.demande_id + "/all")
        .then((response) => {
          if (response.status == 200) {
            // console.log(response.data);
            this.offers = response.data;
            this.loading = false;
            // this.offer.prix_offert = offer.prix_offert;
            // this.offer.wilaya_id = offer.wilaya_id;
            // this.offer.etat_id = offer.etat_id;
            // this.offer.note = offer.note;
            // // console.log(response.data.image)
            // this.offer.url = (response.data.image)
          } else return;
        })
        .catch(() => {
          return ["no data found"];
        });
    },
    showDetail(it) {
      
      this.offer.wilaya = this.$store.state.wilayas.find(
        (item) => item.id == it.reponse.wilaya_id).name;
      this.offer.etat =  it.reponse.etat.nom_fr
      this.offer.note =  it.reponse.note
      this.offer.phone =  it.phone
      this.offer.image =  it.image
      console.log(it.image);
      this.dialog = true;
    },
  },
  mounted() {
    this.getOffers();
  },
};
</script>
