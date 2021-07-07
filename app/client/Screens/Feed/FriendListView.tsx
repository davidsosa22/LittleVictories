import React, { ReactElement } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { v4 as getKey } from 'uuid';
import SingleFriend from './SingleFriend';

const FriendListView = ({ query, user, users, setUsers }): ReactElement => {
  return (
    <FlatList
      keyExtractor={() => getKey()}
      data={users.filter((user) => {
        return user.username.toLowerCase().includes(query.toLowerCase());
      })}
      renderItem={({ item }) => (
        <SingleFriend
          item={item}
          user={user}
          users={users}
          setUsers={setUsers}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center'
  },
  header: {
    color: '#1D426D',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20
  },
  listItem: {
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  metaInfo: {
    marginLeft: 10
  },
  text: {
    fontSize: 20,
    color: '#101010',
    marginTop: 60,
    fontWeight: '700'
  },
  textAreaContainer: {
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20
  },
  textInput: {
    textAlign: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: '#009688',
    borderRadius: 8,
    backgroundColor: '#FFFF'
  },
  title: {
    fontSize: 18,
    width: 200,
    padding: 10
  }
});

export default FriendListView;
