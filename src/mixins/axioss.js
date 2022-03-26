import {HTTP} from "../http-constants";

const restService = {
    methods: {
        executeRequest(url, payload) {
            return HTTP
                .post(url, JSON.stringify(payload), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        }
    }
}
export default {
    restService
}