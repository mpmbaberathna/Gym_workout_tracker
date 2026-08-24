import { io } from 'socket.io-client';

let socket = null;
let connected = false;

function init() {
  if (socket) return socket;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    socket = io('http://localhost:5000', {
      auth: { token },
      autoConnect: true,
      withCredentials: true,
    });
    socket.on('connect', () => { connected = true; console.log('socket connected', socket.id); });
    socket.on('disconnect', () => { connected = false; });
  } catch (e) {
    console.warn('socket.io-client initialization failed — real-time disabled', e);
    socket = {
      on: () => {},
      off: () => {},
      emit: () => {},
    };
  }
  return socket;
}

export default {
  init,
  on: (ev, cb) => { const s = init(); s.on(ev, cb); },
  off: (ev, cb) => { const s = init(); s.off(ev, cb); },
  emit: (ev, payload) => { const s = init(); s.emit(ev, payload); },
};
