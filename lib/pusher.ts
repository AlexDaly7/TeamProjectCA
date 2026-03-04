import Pusher from 'pusher';
import env from './env';

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: "e41e7620d6ab296d33aa",
  secret: env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true
});

export default pusher;