import React, { useState, useEffect, ReactElement } from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
} from 'react-native';
import axios from 'axios';


const SingleFriend = ({ item, user, users, setUsers }) : ReactElement => {
  const [isFriend, setIsFriend] = useState(item.isFriend);

  const addFriend = async (id: string): Promise<void> => {
    try {
      const addSuccessful = await axios.post(
        'http://localhost:3000/api/friends/',
        {
          userId: user.id,
          friendId: id
        }
      );
      if (addSuccessful) {
        const mappedUsers = users.map((currentUser) => {
          if (currentUser.id === item.id) {
            return { ...currentUser, isFriend: true };
          }
          return currentUser;
        });
        setIsFriend(true);
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const removeFriend = async (id: string): Promise<void> => {
    try {
      await axios.delete(`http://localhost:3000/api/friends/${user.id}/${id}`);
      const mappedUsers = users.map((currentUser) => {
        if (currentUser.id === item.id) {
          return { ...currentUser, isFriend: false };
        }
        return currentUser;
      });
      setIsFriend(false);
      setUsers(mappedUsers);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.textAreaContainer}>
      <View style={styles.metaInfo}>
        <Text style={styles.title}>{item.userName}</Text>
       {!isFriend ? (
          <Button
            onPress={() => {
              addFriend(item.id), alert('Friend Added!');
            }}
            title='Add Friend'
            color='#841584'
            accessibilityLabel='Learn more about this purple button'
          />
        ) :
         (
          <Button
            onPress={() => {
              removeFriend(item.id), alert('Friend Removed');
            }}
            title='Remove Friend'
            color='#841584'
            accessibilityLabel='Learn more about this purple button'
          />
        ) }
      </View>
    </View>
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

export default SingleFriend;