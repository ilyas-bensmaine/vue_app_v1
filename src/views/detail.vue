<template>
  <div class="my-5 px-1">
    <demande :demande="demande" :detail ="detail" :key="'demande_'+this.$route.params.id"></demande>
  </div>
</template>

<script>
import Demande from "../components/Demande";
import { HTTP } from "../http-constants";
export default {
  components: { Demande },
  name: "detail",
  data: () => ({
    detail : true,
    demande: "",
  }),
  mounted(){
    this.getDemande();
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams) => {
         HTTP.get('api/demande/'+toParams.id+'/markAsSeen')
         .then(
           this.getDemande()
         )
         .catch()
      }
    )
    this.markAsSeen();
  },
  methods: {
    markAsSeen(){
     HTTP.get('api/demande/'+this.$route.params.id+'/markAsSeen')
     .then((response)=> {
       console.log(response.data)
     }).catch(()=>{
       console.log('error')
     })
   },
    async getDemande() {
      let response = await HTTP.get("api/demande/" + this.$route.params.id);
      this.demande = response.data[0];
    },
  },
};
</script>
