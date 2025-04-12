import express from 'express';
import cors from 'cors';

import usersRouter from '../db/routes/users.routes';
import exercisesRouter from '../db/routes/exercises.routes';
import workoutsRouter from '../db/routes/workouts.routes';

import { LOCAL_IP } from '../../local.config';

const app = express();
const PORT = 8008;

app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);
app.use('/workouts', workoutsRouter);

app.get('/', (_, res) => {
  res.send('Try /users');
});

app.listen(PORT, LOCAL_IP, () =>
  console.log('App has started on', `${LOCAL_IP}:${PORT}`),
);
