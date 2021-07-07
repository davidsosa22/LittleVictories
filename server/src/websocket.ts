import { createServer } from 'http';
import app from './app';
import { Server } from 'socket.io';

import { Task } from './database/models/task';
import { Like } from './database/models/like';
import { Comment } from './database/models/comment';
import { User } from './database/models/user';
import { Friend } from './database/models/friend';

import { FormattedTask } from './interfaces/tasks';

import { client } from './database';

const httpServer = createServer(app);
const options = {};
const io = new Server(httpServer, options);

const fetchTask = async (id: number): Promise<FormattedTask> => {
  const task = await Task.findOne({ where: { id } });
  const likes = await Like.findAll({ where: { task_id: id } });
  const comments = await Comment.findAll({ where: { task_id: id } });
  const user = await User.findOne({
    where: { id: task?.getDataValue('user_id') }
  });
  const username = user?.getDataValue('username');
  const mappedComments = await Promise.all(
    comments.map(async (comment) => {
      const currentUser = await User.findOne({
        where: { id: comment.getDataValue('user_id') }
      });
      return {
        id: comment.getDataValue('id'),
        content: comment.getDataValue('content'),
        user_id: comment.getDataValue('user_id'),
        username: currentUser?.getDataValue('username')
      };
    })
  );
  return {
    id: task?.getDataValue('id'),
    username,
    description: task?.getDataValue('description'),
    completed_at: task?.getDataValue('completed_at'),
    likes,
    comments: mappedComments
  };
};

const getUserId = (socketId: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    client.get(socketId, (err, clientId) => {
      if (err) {
        reject(err);
      }
      resolve(clientId ? clientId : null);
    });
  });
};

const fetchFriends = async (userId: string): Promise<string[]> => {
  const friends = await Friend.findAll({ where: { friend_id: userId } });
  const mappedFriends = friends.map((friend) => friend.user_id.toString());
  return mappedFriends;
};

const updateFeed = async (
  taskId: number,
  socketId: string,
  event: string
): Promise<void> => {
  const foundTask = await fetchTask(taskId);
  const userId = await getUserId(socketId);
  console.log('userId', userId);

  if (userId) {
    const friends = await fetchFriends(userId);
    const sockets = io.sockets.sockets;
    for (const currentSocket of sockets) {
      const currentUserId = await getUserId(currentSocket[0]);
      if (currentUserId && friends.includes(currentUserId)) {
        io.to(currentSocket[0]).emit(event, foundTask);
      }
    }
  }
};

io.on('connection', (socket) => {
  socket.on('addToFeed', (task) => {
    updateFeed(task.id, socket.id, 'addToFeed');
  });

  socket.on('removeFromFeed', async (taskId) => {
    const userId = await getUserId(socket.id);
    if (userId) {
      const friends = await fetchFriends(userId);
      const sockets = io.sockets.sockets;
      for (const currentSocket of sockets) {
        const currentUserId = await getUserId(currentSocket[0]);
        if (currentUserId && friends.includes(currentUserId)) {
          io.to(currentSocket[0]).emit('removeFromFeed', taskId);
        }
      }
    }
  });

  socket.on('addLike', async (like) => {
    updateFeed(like.task_id, socket.id, 'addLike');
  });

  socket.on('removeLike', async (taskId) => {
    updateFeed(taskId, socket.id, 'removeLike');
  });

  socket.on('addComment', async (comment) => {
    updateFeed(comment.task_id, socket.id, 'addComment');
  });

  socket.on('removeComment', async (taskId) => {
    updateFeed(taskId, socket.id, 'removeComment');
  });

  socket.on('loggedIn', (userId) => {
    console.log('in logged in:', userId);
    client.set(socket.id, userId);
  });
  socket.on('loggedOut', (userId) => client.del(userId));
});

export default httpServer;
