<template>
  <div>
    <v-dialog v-model="dialog" eager max-width="100%">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="my-2" block v-bind="attrs" right v-on="on" outlined color="info">
          S'inscrire
        </v-btn>
      </template>
      <v-form ref="form" class="mx-2" lazy-validation>
      <v-card class="pa-0">
        <v-card-title>
         
          <span class="text-h5">S'inscrire</span>
          <v-spacer/>
           <v-btn
              icon
              dark
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-stepper v-model="e1">
          <v-card-text>
            <v-container>
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">
                  Information de contact
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">
                  Information sur les catégories
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">
                  information sur les marques et les modèles
                </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-row dense>
                    <v-col cols="12">
                      <!-- nom -->
                      <v-text-field
                        label="Nom et prénom *"
                        
                        prepend-icon="mdi-account"
                        hide-details="auto"
                        :rules="nameRules"
                        v-model="user.name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <!-- notes -->
                      <v-text-field
                        type="password"
                        label="Mot de passe *"
                        prepend-icon="mdi-key"
                        hide-details="auto"
                        :rules="passRules"
                        v-model="user.password"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <!-- phone -->
                      <v-text-field
                        prepend-icon="mdi-phone"
                        label="Numéros de telephone *"
                        hide-details="auto"
                        :rules="phoneRules"
                        v-model="user.phone"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <!-- wilaya -->
                      <v-autocomplete
                        :items="wilayas"
                        item-text="name"
                        item-value="id"
                        label="Wilaya *"
                        prepend-icon="mdi-google-maps"
                        required
                        :rules="wilayaRules"
                        v-model="user.wilaya"
                      >
                        <template v-slot:item="slotProps"
                          >{{ slotProps.item.code}}-{{ slotProps.item.name }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-row dense>
                    <v-col cols="12">
                      <!-- Type -->
                      <v-autocomplete ref="types"
                        :items="types"
                        item-text="nom_ar"
                        item-value="id"
                        :rules="typeRules"
                        label="Types de véhicules *"
                        chips
                        required
                        multiple
                        v-model="user.types"
                        close
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="removeItem(data.item, user.types)"
                          >
                            {{ data.item.nom_ar }}
                          </v-chip>
                        </template>
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
                        v-model="user.marques"
                        @change="getModeles($event)"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="removeItem(data.item, user.marques)"
                          >
                            {{ data.item.nom_ar }}
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
                        v-model="user.modeles"
                        required
                        chips
                        multiple
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="removeItem(data.item, user.modeles)"
                          >
                            {{ data.item.nom_ar }}
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-stepper-content>
                <v-stepper-content step="3">
                  <v-row dense>
                    <v-col cols="12">
                      <!-- categories -->
                      <v-autocomplete
                        :items="categories"
                        item-text="nom_fr"
                        item-value="id"
                        label="Categories des pieces"
                        required
                        multiple
                        chips
                        v-model="user.categories"
                        @change="getSubCategories"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="
                              removeItem(data.item, user.categories)
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
                        multiple
                        label="Sous categories"
                        v-model="user.subcategories"
                        @change="getSubSubCategories"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="
                              removeItem(data.item, user.subcategories)
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
                        multiple
                        label="Sous sous categorie de la piece"
                        v-model="user.subsubcategories"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click="data.select"
                            @click:close="
                              removeItem(data.item, user.subsubcategories)
                            "
                          >
                            {{ data.item.nom_fr }}
                          </v-chip>
                        </template>
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
              @click.prevent="register()"
            >
              S'inscrire
            </v-btn>
          </v-card-actions>
        </v-stepper>
      </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "../http-constants";

export default {
  name: "register",
  data: () => ({
    nameRules: [(v) => !!v || "Name is required"],
    phoneRules: [
      (v) => !!v || "Phone is required",
      (v) => /^\d+$/.test(v) || "Phone must be a number",
    ],
    passRules: [(v) => !!v || "password is required"],
    typeRules: [(v) => v.length != 0 || "type is required"],
    wilayaRules: [(v) => !!v || "wilaya is required"],

    e1: 1,
    dialog: false,
    user: {
      types: [],
      marques: [],
      modeles: [],
      categories: [],
      subcategories: [],
      subsubcategories: [],
      image: "",
      bio: "",
      wilaya: "",
      name: "",
      password: "",
      phone: "",
    },
    types: [],
    marques: [],
    modeles: [],
    categories: [],
    subcategories: [],
    subsubcategories: [],
    wilayas: [],
    etats: [],
  }),
  methods: {
    removeItem(item, list) {
      const index = list.indexOf(item.id);
      if (index >= 0) list.splice(index, 1);
    },
    async getTypes() {
      let response = await HTTP.get("api/type");
      this.types = response.data;
    },
    async getMarques() {
      let response = await HTTP.get("api/marque");
      this.marques = response.data;
    },
    //-----------------------------------
    getModeles() {
      this.modeles = [];
      HTTP.post("api/marque/modele", this.user.marques)
        .then((repsponse) => {
          this.modeles = this.modeles.concat(repsponse.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //-----------------------------------
    async getCategories() {
      let response = await HTTP.get("api/category");
      this.categories = response.data;
    },
    getSubCategories() {
      HTTP.post("api/category/subcategories" , this.user.categories)
        .then((repsponse) => {
          this.subcategories = this.subcategories.concat(repsponse.data)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubSubCategories() {
      HTTP.post("api/subcategory/subcategory2s" ,  this.user.subcategories)
        .then((repsponse) => {
          this.subsubcategories = this.subsubcategories.concat (repsponse.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    register() {
      if(this.$refs.form.validate()){
        HTTP.post("api/register", this.user)
          .then(() => {
            HTTP.get("/sanctum/csrf-cookie").then(() => {
              HTTP.post("api/login", {
                phone: this.user.phone,
                password: this.user.password,
              })
                .then(() => {
                  this.$store.dispatch("auth/login");
                  this.dialog = false;
                  this.$emit("RefreshUser");
                  this.$toasted.info("Bienvenue", {
                    theme: "bubble",
                    position: "top-center",
                    duration: 5000,
                    keepOnHover: true,
                  });
                })
                .catch((error) => {
                  console.log(error);
                })
                .finally();
            });
          })
          .catch();
        }
      else{
         if(this.user.types.length ==0){
            this.e1 = 2;        
        }
        else
        this.e1 = 1
      }
    },
  },
  mounted() {
    this.wilayas = this.$store.state.wilayas;

    this.getTypes();
    this.getMarques();
    this.getCategories();
    
    // console.log(this.types)
  },
};
</script>
<style>
.container{
     max-width: 100vw;
     padding:0px;
     margin: 0px;
  }
</style>
