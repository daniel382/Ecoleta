import knex from '../database/connection';
import { Request, Response } from 'express';

import host from '../config/host';

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city).trim())
      .where('uf', String(uf).trim())
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => ({
      ...point,
      image_url: `http://${host.addr}:${host.port}/uploads/${point.image}`
    }));

    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex('points').where('id', id).first();

    if (!point)
      return res.status(400).json({ ok: false, message: 'Point not found.' });

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    const serializedPoint = {
      ...point,
      image_url: `http://${host.addr}:${host.port}/uploads/${point.image}`
    };

    return res.json({ point: serializedPoint, items });
  }

  async create(req: Request, res: Response) {
    const {
      name, email, whatsapp, latitude, longitude, city, uf, items
    } = req.body;

    if (!req.file)
      return res.status(400).json({
        message: 'Image is required. Only images are allowed'
      });

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: req.file.filename
    };

    // transações
    const trx = await knex.transaction();

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => ({ item_id, point_id }));

    await trx('point_items').insert(pointItems);

    await trx.commit();
    return res.json({ ok: true, data: { id: point_id, ...point } });
  }
}

export default new PointsController();
