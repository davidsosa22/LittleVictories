import { JournalEntry } from '../database/models/journalEntry';
import { RequestHandler } from 'express';
import { AddJournalEntryReqBody } from '../interfaces/journalEntries';

export const getJournalEntry: RequestHandler<{
  user_id: string;
  date: string;
}> = async (req, res): Promise<void> => {
  const { user_id, date } = req.params;
  try {
    const journalEntry = await JournalEntry.findOne({
      where: { date: date, user_id: user_id }
    });
    res.status(200).send(journalEntry);
  } catch (err) {
    console.log('error fetching journal Entry', err);
    res.sendStatus(500);
  }
};

export const getAllJournals: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { user_id } = req.params;
  try {
    const allJournals = await JournalEntry.findAll({
      where: { user_id: user_id }
    });
    res.status(200).send(allJournals);
  } catch (err) {
    console.log('error fetching journal Entry', err);
    res.sendStatus(500);
  }
};

export const addJournalEntry: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { user_id, content, date } = req.body as AddJournalEntryReqBody;

  if (content === '') {
    try {
      await JournalEntry.destroy({ where: { date: date, user_id: user_id } });
      res.sendStatus(201);
    } catch (err) {
      console.log('error deleting entry', err);
      res.sendStatus(500);
    }
  } else {
    // check for already existing journalEntry
    const journalEntry = await JournalEntry.findOne({ where: { date: date } });
    // if it exists, edit the existing one's content
    if (journalEntry) {
      const updatedEntry = await journalEntry.update({ content: content });
      res.sendStatus(201);
    } else {
      // if it does not, create it
      try {
        await JournalEntry.create({
          user_id,
          content,
          date
        });
        res.status(201);
      } catch (err) {
        console.log('entry submission error', err);
        res.sendStatus(500);
      }
    }
  }
};

export const deleteJournal: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { user_id, date } = req.params;
  try {
    await JournalEntry.destroy({ where: { user_id, date } });
    res.sendStatus(201);
  } catch (err) {
    console.log('error deleting entry', err);
    res.sendStatus(500);
  }
};
