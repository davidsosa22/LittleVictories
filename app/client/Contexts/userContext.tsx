import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserStat } from '../Interfaces/user';

interface UserContextState {
  user: User;
  setUser: (user: User) => void;
  userStat: UserStat | null;
  setUserStat: (userStat: UserStat) => void;
}

export const UserDefaultValues: UserContextState = {
  user: {
    id: '',
    username: '',
    tasks: [],
    habits: [],
    points: 0,
    level: 0,
    entries: [],
    readable_font: false,
    userStats: []
  },
  setUser: (user: User): void => {},
  userStat: null,
  setUserStat: (userStat: UserStat): void => {}
};

const UserContext = createContext<UserContextState>(UserDefaultValues);

export const UserContextProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User>(UserDefaultValues.user);
  const [userStat, setUserStat] = useState<UserStat>(
    UserDefaultValues.userStat
  );

  return (
    <UserContext.Provider value={{ user, setUser, userStat, setUserStat }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
