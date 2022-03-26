import {HTTP} from "../http-constants";
import createPersistedState from 'vuex-persistedstate'

export default{
    state: {
        wilayas : [],
        etats : [],
    },
    mutations: {
       SET_WILAYAS(state , wilayas){
           state.wilayas = wilayas;
       },
        SET_ETATS(state , etats){
           state.etats = etats;
       },
    },
    actions :{
        async loadWilayas({commit}){
            let response = await HTTP.get('api/wilaya');
            commit('SET_WILAYAS' , response.data);
        },
        async loadEtats({commit}){
            let response = await HTTP.get('api/etat');
            commit('SET_ETATS' , response.data);
        }
    },

}

