import express from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import pointsController from './controllers/PointsController';
import itemsController from './controllers/ItemsController';
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points/:id', pointsController.show);

routes.get(
  '/points',
  upload.single('image'),
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
  pointsController.index);

export default routes;
