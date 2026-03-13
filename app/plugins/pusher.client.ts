import Pusher from "pusher-js";

export default defineNuxtPlugin(() => {
    const pusher = new Pusher("e41e7620d6ab296d33aa", { 
        cluster: "eu"
    });
    Pusher.logToConsole = true;

    return {
        provide: { pusher }
    }
})