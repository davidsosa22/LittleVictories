import { AddListReqBody, RemoveListReqParams } from './../interfaces/lists';
import { List } from '../database/models/list';
import { RequestHandler } from 'express';

export const getLists: RequestHandler = async (req, res): Promise<void> => {
  const lists = await List.findAll();
  res.send(lists);
};

export const addList: RequestHandler = async (req, res): Promise<void> => {
  const { listName } = req.body as AddListReqBody;
  const newList = await List.create({
    name: listName
  });
  res.send(newList);
};

export const removeList: RequestHandler<RemoveListReqParams> = async (
  req,
  res
): Promise<void> => {
  const { id } = req.params;
  await List.destroy({ where: { id } });
  res.send(`list with id of ${id} has been removed from the db.`);
};
