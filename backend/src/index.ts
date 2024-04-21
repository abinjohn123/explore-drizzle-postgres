import express from 'express';

import usersRouter from '../db/routes/users.routes';
import exercisesRouter from '../db/routes/exercises.routes';

const app = express();
const PORT = 8008;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);

app.get('/', (_, res) => {
  res.send('Try /users');
});

app.listen(PORT, () => console.log('App has started on port', PORT));
