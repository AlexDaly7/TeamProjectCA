import Pusher from 'pusher';
import env from './env';

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: "18764a9bbb57f153f5f",
  secret: env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true
});

export default pusher;