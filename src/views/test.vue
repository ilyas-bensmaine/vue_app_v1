<template>
  <div id="app">
    <h1>Hello</h1>
  </div>
</template>

<script>
import axios from "axios";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

console.log(Pusher);

export default {
  name: "App",

  data() {
    return {
      data: {
        phone: "0659403798",
        password: "password",
      },
    };
  },

  async mounted() {
    axios.defaults.withCredentials = true;

    await axios.get("http://auto_parts.local:8080/sanctum/csrf-cookie");

    await axios.post("http://auto_parts.local:8080/api/login", this.data);

    const { data } = await axios.get("http://auto_parts.local:8080/api/user");
    console.log(data)
    let echo = new Echo({
      broadcaster: "pusher",
      key: "123",
      wsHost: "auto_parts.local",
      wsPort: 6001,
      forceTLS: false,
      cluster: "mt1",
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
      },
    });
    console.log(echo)
    echo.private(`App.Models.User.${data.id}`).notification((notification) => {
        console.log(notification.message);
      });
    //  echo
    //   .channel(`channel`)
    //   .listen("new-message-event", (message) => {
    //     console.log(message);

    //   });
  
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
