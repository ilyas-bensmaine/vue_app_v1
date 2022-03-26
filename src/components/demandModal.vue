<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="90%">
      <template v-slot:activator="{ on, attrs }">
        <v-btn small fab v-bind="attrs" right v-on="on" color="primary">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-form ref="form" class="mx-2" lazy-validation>
          <v-card-title>
            <span class="text-h5">Nouvelle demande</span>
            <v-spacer />
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-stepper v-model="e1">
            <v-card-text>
              <v-container>
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">
                    Marque et modele de véhicule
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step :complete="e1 > 2" step="2">
                    Catégorie de la piece
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="3">
                    information additionnel
                  </v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-row dense>
                      <v-col cols="12">
                        <!-- Type -->
                        <v-autocomplete
                          :items="types"
                          item-text="nom_ar"
                          item-value="id"
                          :rules="typeRules"
                          label="Type de la véhicule"
                          required
                          v-model="demand.type"
                          @change="getMarques()"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <!-- marques -->
                        <v-autocomplete
                          multiple
                          chips
                          :items="marques"
                          item-text="nom_ar"
                          item-value="id"
                          label="Marque de la véhicule"
                          required
                          v-model="demand.marques"
                          @change="getModeles()"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.marques)
                              "
                            >
                              {{ data.item.nom_fr }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <!-- modeles -->
                        <v-autocomplete
                          :items="modeles"
                          item-text="nom_ar"
                          item-value="id"
                          label="Modele de la véhicule"
                          v-model="demand.modeles"
                          required
                          multiple
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.modeles)
                              "
                            >
                              {{ data.item.nom_fr }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-file-input
                          label="Photos de la pièce"
                          prepend-icon="mdi-camera"
                          multiple
                          show-size
                          @change="uploadPhotos"
                          accept="image/*"
                          v-model="image"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-img max-width="200" v-if="url" :src="url"></v-img>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-row dense>
                      <v-col cols="12">
                        <!-- categories -->
                        <v-autocomplete
                          :items="categories"
                          item-text="nom_fr"
                          item-value="id"
                          label="Categories de la pièce"
                          :rules="categoryRules"
                          multiple
                          v-model="demand.categories"
                          @change="getSubCategories()"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.categories)
                              "
                            >
                              {{ data.item.nom_fr }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <!-- subcategories -->
                        <v-autocomplete
                          :items="subcategories"
                          item-text="nom_fr"
                          item-value="id"
                          label="Sous categorie de la piece"
                          v-model="demand.subcategories"
                          multiple
                          @change="getSubSubCategories($event)"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.subcategories)
                              "
                            >
                              {{ data.item.nom_fr }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <!-- subsubcategories -->
                        <v-autocomplete
                          :items="subsubcategories"
                          item-text="nom_fr"
                          item-value="id"
                          label="Sous sous categorie de la piece"
                          v-model="demand.subsubcategories"
                          multiple
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.subsubcategories)
                              "
                            >
                              {{ data.item.nom_fr }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-row dense>
                      <v-col cols="12">
                        <!-- notes -->
                        <v-textarea
                          clearable
                          auto-grow
                          dense
                          clear-icon="mdi-close-circle"
                          label="Note"
                          v-model="demand.note"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <!-- wilaya -->
                        <v-autocomplete
                          :items="wilayas"
                          item-text="name"
                          :rules="wilayaRules"
                          item-value="id"
                          label="Wilaya de la demande"
                          prepend-icon="mdi-google-maps"
                          required
                          v-model="demand.wilaya"
                        >
                          <template v-slot:item="slotProps"
                            >{{ slotProps.item.code }}-{{ slotProps.item.name }}
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <!-- etat -->
                        <v-autocomplete
                          :items="etats"
                          :rules="etatRules"
                          item-text="nom_fr"
                          item-value="id"
                          label="Etat de la pièce"
                          required
                          v-model="demand.etat"
                        >
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                </v-stepper-items>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="blue darken-1"
                class="mx-10"
                v-show="e1 > 1"
                @click="e1 = e1 - 1"
              >
                Precident
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                class="mx-10"
                v-show="e1 < 3"
                @click="e1 = e1 + 1"
              >
                Suivant
              </v-btn>
              <v-btn
                color="success"
                class="mx-10"
                v-show="e1 == 3"
                @click.prevent="submitDemande()"
              >
                Demander
              </v-btn>
            </v-card-actions>
          </v-stepper>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { HTTP } from "../http-constants";

export default {
  data: () => ({
    typeRules: [(v) => !!v || "type is required"],
    categoryRules: [(v) => v.length != 0 || "category is required"],
    wilayaRules: [(v) => !!v || "wilaya is required"],
    etatRules: [(v) => !!v || "Etat is required"],

    e1: 1,
    dialog: false,
    demand: {
      type: "",
      marques: [],
      modeles: [],
      categories: [],
      subcategories: [],
      subsubcategories: [],
      etat: "",
      note: "",
      wilaya: "",
    },
    image: null,
    url: "",
    types: [],
    marques: [],
    modeles: [],
    categories: [],
    subcategories: [],
    subsubcategories: [],
    tata: "dfsdf",
  }),
  methods: {
    removeItem(item, list) {
      const index = list.indexOf(item.id);
      if (index >= 0) list.splice(index, 1);
    },
    // step 1
    uploadPhotos() {
      this.url = URL.createObjectURL(this.image[0]);
      console.log(this.url);
    },
    getTypes() {
      HTTP.get("api/type")
        .then((repsponse) => {
          this.types = repsponse.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getMarques() {
      HTTP.get("api/marque")
        .then((repsponse) => {
          this.marques = repsponse.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getModeles() {
      this.modeles = [];
      HTTP.post("api/marque/modele", this.demand.marques)
        .then((repsponse) => {
          this.modeles = this.modeles.concat(repsponse.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //step 2
    getCategories() {
      HTTP.get("api/category")
        .then((repsponse) => {
          this.categories = repsponse.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubCategories() {
      HTTP.post("api/category/subcategories", this.demand.categories)
        .then((repsponse) => {
          this.subcategories = this.subcategories.concat(repsponse.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubSubCategories() {
      HTTP.post("api/subcategory/subcategory2s", this.demand.subcategories)
        .then((repsponse) => {
          this.subsubcategories = this.subsubcategories.concat(repsponse.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // step 3
    submitDemande() {
      let data = new FormData();
      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };
      if (this.image) {
        let im = new Blob(this.image);
        data.append("image", im);
      }
      data.append("type", this.demand.type);
      data.append("marques", this.demand.marques);
      data.append("modeles", this.demand.modeles);
      data.append("category", this.demand.categories);
      data.append("subcategory", this.demand.subcategories);
      data.append("subsubcategory", this.demand.subsubcategories);
      data.append("etat", this.demand.etat);
      data.append("note", this.demand.note);
      data.append("wilaya", this.demand.wilaya);

      if (this.$store.state.auth.authenticated) {
        if (this.$refs.form.validate()) {
          HTTP.post("api/demande", this.demand, config)
            .then((response) => {
              if (response.status == 200) {
                this.dialog = false;
                this.$toasted.success("Demande créée avec succés!", {
                  theme: "bubble",
                  position: "top-center",
                  duration: 5000,
                  keepOnHover: true,
                });
                if (this.$router.name == 'demande') {
                    this.$router.replace({name: "demande",
                  params: { id: response.data },
                });

                }
                else {
                  this.$router.push({
                  name: "demande",
                  params: { id: response.data },
                });
                }
                this.$emit("refreshDemande");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          if (!this.demand.type) {
            this.e1 = 1;
          } else {
            if (this.demand.categories.length == 0) {
              this.e1 = 2;
            }
          }
        }
      } else {
        this.$toasted.show("Vous devez s'inscrire ou se connecter", {
          theme: "bubble",
          position: "top-center",
          duration: 3000,
          keepOnHover: true,
        });
      }
    },
  },
  computed: {
    wilayas() {
      return this.$store.state.wilayas;
    },
    etats() {
      return this.$store.state.etats;
    },
  },

  created() {
    this.getTypes();
    this.getCategories();
  },
};
</script>
