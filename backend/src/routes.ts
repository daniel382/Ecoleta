import express from 'express';
import { celebrate, Joi } from 'celebrate';

import pointsController from './controllers/PointsController';
import itemsController from './controllers/ItemsController';
import upload from './config/multer';

const routes = express.Router();

routes.get('/items', itemsController.index);

routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);

routes.post('/points',
  upload,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      uf: Joi.string().required().max(2),
      city: Joi.string().required(),
      items: Joi.string().required()
    })
  }, {
    abortEarly: false
  }),
  pointsController.create
);

export default routes;
