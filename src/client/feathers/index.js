/* global HOST */
import feathers from 'feathers-client';
import io from 'socket.io-client';

const host = HOST.toString();
const socket = io(host);

import {services} from './services';

import auth from 'feathers-authentication-client';

export const app = feathers().configure(feathers.socketio(socket, {timeout: 15000}))
    .configure(auth({ storage: window.localStorage }))
    .configure(feathers.hooks())
    .configure(services);