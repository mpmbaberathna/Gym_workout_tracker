const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const userRoutes = require('./modules/users/user.routes');
const workoutRoutes = require('./modules/workouts/workout.routes');
const exerciseRoutes = require("./modules/exercises/exercise.routes");
const planRoutes = require("./modules/plans/plan.routes");
const progressRoutes = require("./modules/progress/progress.routes");
const scheduleRoutes = require("./modules/schedules/schedule.routes");
const reviewRoutes = require("./modules/reviews/review.routes");
const messageRoutes = require("./modules/messages/message.routes");




const app = express();
const path = require('path');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (mobile apps, curl)
    if (!origin) return cb(null, true);
    if (origin === FRONTEND_URL) return cb(null, true);
    // allow local dev on either 5173 or 5174
    if (/^https?:\/\/localhost:517[34]$/.test(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session (store in MongoDB)
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);

// serve uploaded files (images)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));



// health check
app.get('/', (req, res) => {
  res.json({ status: 'Gym Workout API running' });
});

module.exports = app;
