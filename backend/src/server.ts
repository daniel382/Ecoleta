import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { errors } from 'celebrate';

import routes from './routes';

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(errors());

// routes
app.use(routes);

// arquivos estáticos
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

app.listen(3333);

export default app;
