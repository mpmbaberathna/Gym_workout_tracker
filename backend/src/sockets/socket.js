let io;

function init(server) {
	try {
		const { Server } = require('socket.io');
		const jwt = require('jsonwebtoken');
		const cookie = require('cookie');
		const signature = require('cookie-signature');
		const MongoStore = require('connect-mongo');

		const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
		io = new Server(server, {
			cors: {
				origin: FRONTEND_URL,
				methods: ['GET', 'POST'],
				credentials: true,
			}
		});

		// create a store instance to read sessions directly from the sessions collection
		const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URI });

		io.on('connection', (socket) => {
			console.log('Socket connected', socket.id);

			// 1) Prefer session cookie authentication
			try {
				const rawCookie = socket.handshake.headers?.cookie;
				if (rawCookie) {
					const parsed = cookie.parse(rawCookie || '');
					let sid = parsed['connect.sid'];
					if (sid) {
						// if cookie looks signed (s:...), unsign it
						if (sid.startsWith('s:')) {
							const unsigned = signature.unsign(sid.slice(2), process.env.SESSION_SECRET || process.env.JWT_SECRET || 'keyboard cat');
							if (unsigned) sid = unsigned;
						}

						// load session from store
						sessionStore.get(sid, (err, sess) => {
							if (!err && sess && sess.user) {
								try {
									const uid = sess.user.id?.toString();
									const role = (sess.user.role || '').toString();
									socket.join(`user:${uid}`);
									socket.join(`role:${role}`);
									socket.session = sess;
								} catch (e) {}
							}
						});
					}
				}
			} catch (e) {
				// continue to JWT fallback
			}

			// 2) Fallback: try to authenticate socket using token passed in handshake auth
			try {
				const token = socket.handshake?.auth?.token || socket.handshake?.query?.token;
				if (token) {
					const decoded = jwt.verify(token, process.env.JWT_SECRET);
					if (decoded && decoded.id) {
						const uid = decoded.id.toString();
						const role = (decoded.role || '').toString();
						try { socket.join(`user:${uid}`); } catch (e) {}
						try { socket.join(`role:${role}`); } catch (e) {}
					}
				}
			} catch (e) {
				// invalid token — still allow connection but no rooms
			}

			// allow clients to request joining additional rooms
			socket.on('join', (room) => {
				try { socket.join(room); } catch (e) {}
			});

			socket.on('disconnect', () => {});
		});
	} catch (err) {
		console.error('Failed to init socket.io', err);
	}
}

function getIO() {
	return io;
}

module.exports = { init, getIO };
