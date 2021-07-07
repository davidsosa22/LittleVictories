import { Friend } from './../database/models/friend';
import sequelize from 'sequelize';
import { Task } from '../database/models/task';
import { RequestHandler } from 'express';
import { AddTaskReqBody } from '../interfaces/tasks';
import { User } from '../database/models/user';
import { Like } from '../database/models/like';
import { Comment } from '../database/models/comment';
import { TaskReqParams } from '../interfaces/tasks';

const ptsToLvlUp = 250;

export const getTasks: RequestHandler = async (req, res): Promise<void> => {
  const tasks = await Task.findAll();
  res.send(tasks);
};

export const addTask: RequestHandler = async (req, res): Promise<void> => {
  const {
    user_id,
    description,
    due_date,
    minutes_to_complete,
    is_important
    // list_id,
  } = req.body as AddTaskReqBody;
  try {
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      res.send(`no user found with id of ${user_id}`);
    } else {
      const newTask = await Task.create({
        user_id,
        description,
        due_date,
        minutes_to_complete,
        is_important,
        is_complete: false,
        is_public: false
        //list_id,
      });
      res.send({
        id: newTask.getDataValue('id'),
        description: newTask.getDataValue('description'),
        due_date: newTask.getDataValue('due_date'),
        is_complete: newTask.getDataValue('is_complete'),
        is_important: newTask.getDataValue('is_important'),
        minutes_to_complete: newTask.getDataValue('minutes_to_complete')
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log('entry submission error', err.message);
    }
    res.sendStatus(500);
  }
};

export const removeTask: RequestHandler<TaskReqParams> = async (
  req,
  res
): Promise<void> => {
  const { id } = req.params;
  await Like.destroy({ where: { task_id: id } });
  await Comment.destroy({ where: { task_id: id } });
  await Task.destroy({ where: { id } });
  res.send(true);
};

export const markTaskAsComplete: RequestHandler<TaskReqParams> = async (
  req,
  res
): Promise<void> => {
  try {
    const { id } = req.params;
    await Task.update(
      { is_complete: true, completed_at: new Date() },
      { where: { id } }
    );
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      throw new Error(`task with ${id} isn't in db`);
    } else {
      const minutes = task.getDataValue('minutes_to_complete');
      const user = await User.findOne({ where: { id: task.user_id } });
      if (!user) {
        throw new Error(`user with ${task.user_id} isn't in db`);
      } else {
        const currentPoints = user.getDataValue('points');
        const currentLevel = user.getDataValue('level');
        const returnVal = await User.update(
          {
            points:
              currentPoints + minutes < ptsToLvlUp
                ? currentPoints + minutes
                : (currentPoints + minutes) % ptsToLvlUp,
            level:
              currentPoints + minutes < ptsToLvlUp
                ? currentLevel
                : currentLevel + 1
          },
          { where: { id: task.user_id }, returning: true }
        );
        const updatedUser = await User.findOne({ where: { id: task.user_id } });
        res.send({
          task,
          points: updatedUser?.points,
          level: updatedUser?.level
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const markTaskAsIncomplete: RequestHandler<TaskReqParams> = async (
  req,
  res
): Promise<void> => {
  try {
    const { id } = req.params;
    await Like.destroy({ where: { task_id: id } });
    await Comment.destroy({ where: { task_id: id } });
    await Task.update(
      { is_complete: false, is_public: false },
      { where: { id } }
    );
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      throw new Error(`task with ${id} isn't in db`);
    } else {
      const minutes = task.getDataValue('minutes_to_complete');
      const user = await User.findOne({ where: { id: task.user_id } });
      if (!user) {
        throw new Error(`user with ${task.user_id} isn't in db`);
      } else {
        const currentPoints = user.getDataValue('points');
        const currentLevel = user.getDataValue('level');
        await User.update(
          {
            points:
              currentPoints - minutes < 0
                ? ptsToLvlUp - (minutes - currentPoints)
                : currentPoints - minutes,
            level: currentPoints - minutes < 0 ? currentLevel - 1 : currentLevel
          },
          { where: { id: task.user_id } }
        );
        const updatedUser = await User.findOne({ where: { id: task.user_id } });
        res.send({
          task,
          points: updatedUser?.points,
          level: updatedUser?.level
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const markTaskAsPublic: RequestHandler<TaskReqParams> = async (
  req,
  res
): Promise<void> => {
  try {
    const { id } = req.params;
    await Task.update({ is_public: true }, { where: { id } });
    const task = await Task.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: task?.user_id } });
    res.send({
      username: user?.getDataValue('username'),
      description: task?.getDataValue('description'),
      completed_at: task?.getDataValue('completed_at'),
      id: task?.getDataValue('id'),
      likes: [],
      comments: []
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const markTaskAsPrivate: RequestHandler<TaskReqParams> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    await Task.update({ is_public: false }, { where: { id } });
    await Comment.destroy({ where: { task_id: id } });
    await Like.destroy({ where: { task_id: id } });
    res.send(true);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getFeedItems: RequestHandler<TaskReqParams> = async (req, res) => {
  try {
    const { id } = req.params;
    const friends = await Friend.findAll({ where: { user_id: id } });
    const mappedFriends = friends.map((friend) =>
      friend.getDataValue('friend_id')
    );
    mappedFriends.push(id);
    const feed = await Task.findAll({
      where: {
        is_public: true,
        user_id: { [sequelize.Op.in]: mappedFriends }
      },
      order: [['completed_at', 'DESC']],
      limit: 10
    });
    const mappedFeed = await Promise.all(
      feed.map(async (feedItem) => {
        const foundUser = await User.findOne({
          where: { id: feedItem.getDataValue('user_id') }
        });
        const foundUsername = foundUser?.getDataValue('username');
        let likes = await Like.findAll({
          where: { task_id: feedItem.getDataValue('id') }
        });
        const comments = await Comment.findAll({
          where: { task_id: feedItem.getDataValue('id') }
        });
        const mappedComments = await Promise.all(
          comments.map(async (comment) => {
            const user = await User.findOne({ where: { id: comment.user_id } });
            return {
              id: comment.getDataValue('id'),
              content: comment.getDataValue('content'),
              user_id: comment.getDataValue('user_id'),
              username: user?.username
            };
          })
        );
        return {
          id: feedItem.getDataValue('id'),
          username: foundUsername,
          description: feedItem.getDataValue('description'),
          completed_at: feedItem.getDataValue('completed_at'),
          likes,
          comments: mappedComments
        };
      })
    );
    res.send(mappedFeed);
  } catch (error) {
    res.status(500).send(error);
  }
};
