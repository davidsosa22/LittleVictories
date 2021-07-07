import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserContext } from './userContext';
import axios from 'axios';
import { useSocketContext } from '../Contexts/socketContext';
import { FeedItem } from '../Interfaces/feed';

interface FeedContextState {
  feed: FeedItem[];
  setFeed: (feed: FeedItem[]) => void;
  socket: any;
}

const FeedDefaultValues: FeedContextState = {
  feed: [],
  setFeed: (feed: FeedItem[]): void => {},
  socket: null
};

const FeedContext = createContext<FeedContextState>(FeedDefaultValues);

export const FeedContextProvider: React.FunctionComponent = ({ children }) => {
  const [feed, setFeed] = useState<FeedItem[]>(FeedDefaultValues.feed);
  const { socket } = useSocketContext();
  const { user } = useUserContext();

  const updateFeed = (task) => {
    const mappedFeed = feed.map((feedItem) => {
      if (feedItem.id === task.id) {
        return task;
      }
      return feedItem;
    });
    setFeed(mappedFeed);
  };

  socket.on('addToFeed', (feedItem) => setFeed([...feed, feedItem]));
  socket.on('removeFromFeed', (taskId) =>
    setFeed(feed.filter((feedItem) => feedItem.id !== taskId))
  );
  socket.on('addLike', (task) => updateFeed(task));
  socket.on('removeLike', (task) => updateFeed(task));
  socket.on('addComment', (task) => updateFeed(task));
  socket.on('removeComment', (task) => updateFeed(task));

  const fetchFeed = async () => {
    const { data } = await axios.get(
      `http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/tasks/${user.id}`
    );
    return data;
  };

  useEffect(() => {
    if (user) {
      fetchFeed()
        .then((feed) => setFeed(feed))
        .catch((err) => console.warn(err));
    }
  }, [user]);

  return (
    <FeedContext.Provider value={{ feed, setFeed, socket }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeedContext = () => useContext(FeedContext);
