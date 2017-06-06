import feathers from 'feathers-client';
import io from 'socket.io-client';

const host = 'http://localhost:3030';
const socket = io(host);

import {services} from './services';

import auth from 'feathers-authentication-client';

export const app = feathers().configure(feathers.socketio(socket))
    .configure(auth({ storage: window.localStorage }))
    .configure(feathers.hooks())
    .configure(services);