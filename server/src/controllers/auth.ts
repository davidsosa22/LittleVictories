import { UserInstance } from './../database/models/user';
import { RegisterUserReqBody, LoginUserReqBody } from './../interfaces/users';
import { RequestHandler } from 'express';
import { User } from '../database/models/user';
import { v4 as getId } from 'uuid';
import bcrypt from 'bcrypt';
import { Task } from '../database/models/task';
import { JournalEntry } from '../database/models/journalEntry';
import { isPast, format } from 'date-fns';
import { UserStat } from '../database/models/stat';
import { Habit } from '../database/models/habit';
import { Friend } from '../database/models/friend';
export { UserInstance } from '../database/models/user';
import { Like } from '../database/models/like';
import { Comment } from '../database/models/comment';

const getHash = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 12);

const validate = async (
  username: string,
  password: string
): Promise<false | UserInstance> => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return false;
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.hash);
  return !isPasswordCorrect ? false : user;
};

// add return type Promise<false | user>
export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  const { username, password } = req.body as RegisterUserReqBody;
  const user = await User.findOne({ where: { username } });
  if (user) {
    res.send(false);
  } else {
    const newUser = await User.create({
      id: getId(),
      username,
      hash: await getHash(password)
    });
    const formattedUser = {
      id: newUser.id,
      username: newUser.username,
      tasks: [],
      entries: [],
      habits: [],
      points: 0,
      readable_font: false,
      userStats: []
    };
    res.send(formattedUser);
  }
};

export const loginUser: RequestHandler = async (req, res): Promise<void> => {
  const { username, password } = req.body as LoginUserReqBody;
  const isValid = await validate(username, password);
  if (!isValid) {
    res.send(false);
  } else {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const tasks = await Task.findAll({
        where: { user_id: user.id },
        order: [['due_date', 'ASC']]
      });

      const userStat = await UserStat.findOne({
        where: { date: format(new Date(), 'MM-dd-yyyy'), user_id: user.id }
      });
      const userStats = await UserStat.findAll({
        where: { user_id: user.id }
      });

      const habits = await Habit.findAll({ where: { user_id: user.id } });

      const mappedUser = {
        id: user.getDataValue('id'),
        username: user.getDataValue('username'),
        points: user.getDataValue('points'),
        level: user.getDataValue('level'),
        readable_font: user.getDataValue('readable_font')
      };
      const mappedTasks = tasks
        .filter(
          (task) =>
            task.getDataValue('is_complete') === 0 ||
            !isPast(task.getDataValue('due_date'))
        )
        .map((task) => {
          return {
            id: task.getDataValue('id'),
            description: task.getDataValue('description'),
            due_date: task.getDataValue('due_date'),
            minutes_to_complete: task.getDataValue('minutes_to_complete'),
            is_important: task.getDataValue('is_important'),
            is_complete: task.getDataValue('is_complete'),
            is_public: task.getDataValue('is_public')
          };
        });

      const entries = await JournalEntry.findAll({
        where: { user_id: user.id },
        order: [['createdAt', 'DESC']]
      });

      const formattedUser = {
        ...mappedUser,
        tasks: mappedTasks,
        userStat: userStat,
        entries: entries ? entries : [],
        habits: habits ? habits : [],
        userStats: userStats ? userStats : []
      };

      res.send(formattedUser);
    }
  }
};

export const users: RequestHandler = async (req, res): Promise<void> => {
  try {
    const users = await User.findAll();
    const mappedUsers = await Promise.all(
      users.map(async (user) => {
        const isFriend = await Friend.findOne({
          where: {
            friend_id: user.id
          }
        });
        return {
          id: user.getDataValue('id'),
          username: user.getDataValue('username'),
          isFriend: !!isFriend
        };
      })
    );
    res.status(200).send(mappedUsers);
  } catch (err) {
    console.log('error fetching ', err);
    res.sendStatus(500);
  }
};

export const removeUser: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    await Like.destroy({ where: { user_id: id } });
    await Comment.destroy({ where: { user_id: id } });
    await Friend.destroy({ where: { user_id: id } });
    await UserStat.destroy({ where: { user_id: id } });
    await JournalEntry.destroy({ where: { user_id: id } });
    await Habit.destroy({ where: { user_id: id } });
    await Task.destroy({ where: { user_id: id } });
    await User.destroy({ where: { id: id } });
    res.status(201).send(`User ${id} has been deleted from DB.`);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
