import { Habit } from '../database/models/habit';
import { RequestHandler } from 'express';
import { AddHabitReqBody } from '../interfaces/habits';
import { User } from '../database/models/user';

const ptsToLvlUp = 250;

export const addHabit: RequestHandler = async (req, res) => {
  const {
    user_id,
    description,
    frequency,
    days_of_week,
    calendar_date
  } = req.body as AddHabitReqBody;

  try {
    const newHabit = await Habit.create({
      user_id,
      description,
      frequency,
      days_of_week,
      calendar_date
    });
    res.status(201).send(newHabit);
  } catch (err) {
    console.log('habit submission error: ', err.message);
    res.sendStatus(500);
  }
};

export const removeHabit: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    await Habit.destroy({ where: { id } });
    res.send(true);
  } catch (err) {
    console.log('error removing habit: ', err)
  }
};

export const markHabitAsComplete: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    await Habit.update(
      // { is_complete: true, completed_at: new Date() },
      { is_complete: true },
      { where: { id } }
    );
    const habit = await Habit.findOne({ where: { id } });
    if (!habit) {
      throw new Error(`habit with ${id} isn't in db`);
    }
    const user = await User.findOne({ where: { id: habit.user_id } });
    if (!user) {
      throw new Error(`user with ${habit.user_id} isn't in db`);
    }
    const currentPoints = user.getDataValue('points');
    const currentLevel = user.getDataValue('level');
    const minutes = 5;
    const returnVal = await User.update(
      {
        points:
          currentPoints + minutes < ptsToLvlUp
            ? currentPoints + minutes
            : (currentPoints + minutes) % ptsToLvlUp,
        level: currentPoints + minutes < ptsToLvlUp ? currentLevel : currentLevel + 1,
      },
      { where: { id: habit.user_id }, returning: true }
    );
    const updatedUser = await User.findOne({ where: { id: habit.user_id } });
    res.status(200).send({ habit, points: updatedUser?.points, level: updatedUser?.level });
  } catch (err) {
    console.log('error updating habit to compelete: ', err);
    res.sendStatus(500);
  }
};

export const markHabitAsIncomplete: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    await Habit.update({ is_complete: false }, { where: { id } });
    const habit = await Habit.findOne({ where: { id } });
    if (!habit) {
      throw new Error(`habit with ${id} isn't in db`);
    }
    const minutes = 5;
    const user = await User.findOne({ where: { id: habit.user_id } });
    if (!user) {
      throw new Error(`user with ${habit.user_id} isn't in db`);
    }
    const currentPoints = user.getDataValue('points');
    const currentLevel = user.getDataValue('level');
    await User.update(
      {
        points:
          currentPoints - minutes < 0
            ? ptsToLvlUp - (minutes - currentPoints)
            : currentPoints - minutes,
        level: currentPoints - minutes < 0 ? currentLevel - 1 : currentLevel,
      },
      { where: { id: habit.user_id } }
    );
    const updatedUser = await User.findOne({ where: { id: habit.user_id } });
    res.status(200).send({ habit, points: updatedUser?.points, level: updatedUser?.level });
  } catch (err) {
    console.log('error marking habit as incomplete, error: ', err);
    res.sendStatus(500);
  }
};