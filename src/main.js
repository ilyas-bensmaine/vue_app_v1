import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/router';
import store from './store'
import axios from 'axios'
import i18n from './i18n/i18n';

/*********************************/
Vue.config.productionTip = false
/*********************************/

import Toasted from 'vue-toasted';
Vue.use(Toasted)

/*********************************/
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);

/*********************************/
import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);
/*********************************/
/*********************************/
import VueEcho from 'vue-echo-laravel';
window.Pusher = require('pusher-js');
Vue.use(VueEcho, {
  broadcaster: 'pusher',
  key: 123 ,// process.env.MIX_PUSHER_APP_KEY,
  forceTLS: false,
  wsHost:"auto_parts.local",
  wsPort: 6001,
  disableStats: true,
  authorizer: (channel, options) => {
    console.log(options);
    return {
      authorize: (socketId, callback) => {
        axios({
          method: "POST",
          url: "http://auto_parts.local:8080/api/broadcasting/auth",
          data: {
            socket_id: socketId,
            channel_name: channel.name,
          },
        })
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            console.log(error)
            callback(true, error);
          });
      },
    };
  }
});

/*********************************/

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  i18n
}).$mount('#app')



