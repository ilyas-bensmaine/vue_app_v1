import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP} from "../http-constants";
import auth from "./auth";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        wilayas : [],
        etats : [],
    },
    plugins:[
        createPersistedState()
    ],
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
    modules :{auth }
})
export default store;
