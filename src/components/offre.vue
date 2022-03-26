<template>
  <div>
    <v-form ref="form" class="mx-2" lazy-validation>
    <v-expansion-panel-content>
      <v-row>
        <v-col ols="12">
          <v-autocomplete
            dense
            :items="wilayas"
            item-text="name"
            item-value="id"
            label="Votre wilaya"
            prepend-icon="mdi-google-maps"
            :rules="wilayaRules"
            v-model="offer.wilaya_id"
          >
            <template v-slot:item="slotProps"
              >{{ slotProps.item.code }}-{{ slotProps.item.name }}
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12">
          <!-- etat -->
          <v-autocomplete
            dense
            :items="etats"
            item-text="nom_fr"
            item-value="id"
            label="Etat de la pièce"
            prepend-icon="mdi-circle"
            :rules="etatRules"
            v-model="offer.etat_id"
          >
          </v-autocomplete>
        </v-col>
      </v-row>

      <v-text-field
        dense
        placeholder="Prix offert"
        v-model="offer.prix_offert"
        prepend-icon="mdi-currency-usd"
        :rules="prixRules"
        suffix="DZD"
      ></v-text-field>
      <v-textarea
        clearable
        auto-grow
        dense
        clear-icon="mdi-close-circle"
        label="Description"
        prepend-icon="mdi-note"
        v-model="offer.note"
      ></v-textarea>
      <v-col cols="12">
        <v-file-input
          label="Photos de la pièce"
          prepend-icon="mdi-camera"
          multiple
          show-size
          @change="showPhoto"
          accept="image/*"
          v-model="offer.image"
        />
      </v-col>
      <v-col cols="12">
        <v-img max-width="200" v-if="offer.url" :src="offer.url"></v-img>
      </v-col>

      <v-btn
        dense
        fa-flip-horizontal
        outlined
        rounded
        text
        color="success"
        :disabled="disabled"
        @click="SubmitOffer()"
      >
        Repondre
      </v-btn>
      <v-dialog  v-if="offer.id" v-model="delete_dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
           
            dense
            fa-flip-horizontal
            rounded
            text
            color="red"
            :disabled="!disabled"
            v-bind="attrs"
            v-on="on"
          >
            retirer
          </v-btn>
        </template>

        <v-card>
          <v-card-title dark class="text-h7 red lighten-2 justify-center">
            Vous voulez supprimer cet offer
          </v-card-title>

          <v-card-text> cette oppération est permanente </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-2" text @click="retirerOffer">
              Oui supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-expansion-panel-content>
    </v-form>
  </div>
</template>
<script>
import { HTTP } from "../http-constants";
export default {
  props: ["demande_id", "user_id"],
  data: () => ({
     wilayaRules: [(v) => !!v || "wilaya is required"],
     etatRules: [(v) => !!v || "l'état is required"],
     prixRules: [(v) => !!v || "prix is required"],


    disabled: false,
    delete_dialog: false,
    offer: {
      id: "",
      wilaya_id: "", //this.$store.state.auth.user.wilaya_id,
      etat_id: "",
      prix_offert: "",
      note: "",
      image: null,
      url: "",
    },
    dialog: false,
  }),
  computed: {
    wilayas() {
      return this.$store.state.wilayas;
    },
    etats() {
      return this.$store.state.etats;
    },
    auth() {
      return this.$store.state.auth.authenticated;
    },
  },
  methods: {
    showPhoto() {
      this.offer.url = URL.createObjectURL(this.offer.image[0]);
    },

    getMyOffer() {
      HTTP.get("api/reponse/" + this.demande_id)
        .then((response) => {
          if (response.status == 200) {
            let offer = response.data.reponse;
            this.offer.id = offer.id;
            this.offer.prix_offert = offer.prix_offert;
            this.offer.wilaya_id = offer.wilaya_id;
            this.offer.etat_id = offer.etat_id;
            this.offer.note = offer.note;
            // console.log(response.data.image)
            this.offer.url = response.data.image;
            this.disabled = true;
          }
        })
        .catch(() => {
          return ["no data found"];
        });
    },
    retirerOffer() {
      HTTP.delete("api/reponse/" + this.offer.id)
        .then((response) => {
          if (response.status == 200) {
            this.delete_dialog = false;
            console.log(response.data);
            this.offer = {
              id: "",
              wilaya_id: "", //this.$store.state.auth.user.wilaya_id,
              etat_id: "",
              prix_offert: "",
              note: "",
              image: null,
              url: "",
            };
            this.disabled = false;
            this.$toasted.danger("Offre retiré avec succés", {
              theme: ["bubble", "outlined"],
              position: "top-center",
              duration: 5000,
              keepOnHover: true,
            });
          }
        })
        .catch((error) => {
          return [error];
        });
    },
    SubmitOffer() {
      if(!this.$refs.form.validate())
      {
          return
      }
      else{
        if (this.auth) {
        let formData = new FormData();
        formData.append("demande_id", this.demande_id);
        formData.append("prix_offert", this.offer.prix_offert);
        formData.append("wilaya_id", this.offer.wilaya_id);
        formData.append("etat_id", this.offer.etat_id);
        formData.append("note", this.offer.note);
        if (this.offer.image) {
          let im = new Blob(this.offer.image);
          formData.append("image", im);
        }
        HTTP.post("api/demande/" + this.demande_id + "/offer", formData)
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data.id);
              this.offer.id = response.data.id;
              this.disabled = true;
              this.$toasted.success("Offre créé avec succés", {
                theme: "bubble",
                position: "top-center",
                duration: 3000,
                keepOnHover: true,
              });
            }
          })
          .catch((error) => {
            return [error];
          });
      } else {
         this.$toasted.show("Vous devez s'inscrire ou se connecter", {
                theme: "bubble",
                position: "top-center",
                duration: 3000,
                keepOnHover: true,
         })
      }
      }
    },
  },
  created() {
    this.getMyOffer();
  },
};
</script>

