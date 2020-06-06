import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { errors } from 'celebrate';

import routes from './routes';
import host from './config/host';

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use(routes);

app.use(errors());

// arquivos estáticos
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

const { addr, port } = host;
app.listen(port, () => console.log(`Running on http://${addr}:${port}`));

export default app;
