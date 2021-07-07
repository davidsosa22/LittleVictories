import { RequestHandler } from 'express';
import { Like } from '../database/models/like';
import { LikeTaskReqBody } from '../interfaces/likes';
import { UnlikeTaskReqParams } from '../interfaces/likes';

export const likeTask: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, taskId } = req.body as LikeTaskReqBody;
    const newLike = await Like.create({
      user_id: userId,
      task_id: taskId
    });
    res.send(newLike);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const unlikeTask: RequestHandler<UnlikeTaskReqParams> = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId, taskId } = req.params;
    await Like.destroy({ where: { user_id: userId, task_id: taskId } });
    res.send(true);
  } catch (error) {
    res.status(500).send(error);
  }
};
