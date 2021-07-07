import { RequestHandler } from 'express';
import { User } from '../database/models/user';
import { Friend } from '../database/models/friend';
import { AddFriendReqBody } from '../interfaces/friends';
import { RemoveFriendReqParams } from '../interfaces/friends';

export const addFriend: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, friendId } = req.body as AddFriendReqBody;
    const user = await User.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      res.send('user does not exist');
    } else {
      const friend = await User.findOne({
        where: {
          id: friendId
        }
      });
      if (!friend) {
        res.send('friend does not exist');
      } else {
        if (user && friend) {
          const friendShip = await Friend.create({
            user_id: user.id,
            friend_id: friend.id
          });

          if (!friendShip) {
            res.send('friendShip insertion did not work');
          } else {
            res.send(true);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeFriend: RequestHandler<RemoveFriendReqParams> = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      res.send('user does not exist');
    } else {
      const friend = await User.findOne({
        where: {
          id: friendId
        }
      });
      if (!friend) {
        res.send('friend does not exist');
      } else {
        if (user && friend) {
          await Friend.destroy({
            where: {
              user_id: user.id,
              friend_id: friend.id
            }
          });
          res.send(true);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
