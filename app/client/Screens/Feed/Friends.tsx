import React, { useState, useEffect, ReactElement } from 'react';
import { useUserContext } from '../../Contexts/userContext';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import { textStyles } from '../../Stylesheets/Stylesheet';
import FriendListView from './FriendListView';

const Friends = (): ReactElement => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const { user } = useUserContext();

  const getAllUsers = () => {
    axios
      .get(
        'http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/auth/users'
      )
      .then(({ data }) => {
        setUsers(
          data.filter((users) => {
            return users.username !== user.username;
          })
        );
      })
      .catch((err) => console.warn(err, 'l'));
  };

  useEffect(() => {
    if (user) {
      getAllUsers();
    }
  }, [user]);

  // const handleSearch = (text) => {
  //   const filteredData = filter(fullData, (user) => {
  //     const itemData = user.username.toUpperCase();
  //     const textData = text.toUpperCase();
  //     return itemData.indexOf(textData) > -1;
  //   });
  //   setUsers(filteredData);
  //   setQuery(text);
  // };

  return (
    <View style={styles.main}>
      <Text style={user.readable_font ? textStyles.h1_big : textStyles.h1}>
        User Search
      </Text>
      <TextInput
        autoCorrect={false}
        style={styles.textInput}
        onChangeText={setQuery}
        value={query}
        placeholder='Search'
      />
      <FriendListView
        query={query}
        user={user}
        users={users}
        setUsers={setUsers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginTop: 10,
    padding: 20
  },
  main: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20
  },
  textAreaContainer: {
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    padding: 20,
    marginTop: 20
  },
  textInput: {
    height: 42,
    borderRadius: 8,
    backgroundColor: '#FFFF',
    padding: 10,
    fontSize: 18,
    color: '#1D426D',
    marginTop: 10
  }
});

export default Friends;
