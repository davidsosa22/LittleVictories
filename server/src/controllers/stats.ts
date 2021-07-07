import { UserStat } from '../database/models/stat';
import { RequestHandler } from 'express';
import { AddStatsReqBody } from '../interfaces/stats';

export const addStats: RequestHandler = async (req, res) => {
  const {
    user_id,
    sleep_hours,
    eaten_well,
    exercised,
    notes,
    date,
    mood
  } = req.body as AddStatsReqBody;

  try {
    const stats = await UserStat.create({
      user_id,
      sleep_hours,
      eaten_well,
      exercised,
      notes,
      mood,
      date
    });
    res.status(201).send(stats);
  } catch (err) {
    console.log('stat submission error: ', err.message);
    res.sendStatus(500);
  }
};