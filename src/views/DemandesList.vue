<template>
  <div>
    <div class="justify-center">
      <v-btn large block text @click="refresh" >
        <v-icon large>mdi-refresh</v-icon>
      </v-btn>
    </div>
    <div class="my-5 px-1" v-for="(demande, index) in demandes" :key="index">
      <demande :demande="demande" :detail="detail"></demande>
    </div>
  </div>
</template>
<script>
import Demande from "../components/Demande.vue";
import { HTTP } from "../http-constants";
import { mapActions } from "vuex";
export default {
  components: { Demande },
  data: () => ({
    detail: false,
    demandes: [],
  }),
  methods: {
    ...mapActions({
      sinIn: "auth/login",
    }),
    async refresh(){
      this.demandes = [];
      this.getDemandes();
    },
    async getDemandes() {
      let response = await HTTP.get("api/demande/");
      this.demandes = response.data;
    },
  },

  created() {
    this.getDemandes();
  },
};
</script>
