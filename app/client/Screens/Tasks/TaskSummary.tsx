import React, { ReactElement } from 'react';
import { v4 as getKey } from 'uuid';

import { StyleSheet, FlatList, View } from 'react-native';
import { useUserContext } from '../../Contexts/userContext';
import SingleTask from './SingleTask';
import TaskForm from './TaskForm';


const TaskList = ({ item }) => {
  return <SingleTask item={item} />;
};

const TaskSummary = () : ReactElement => {
  const { user } = useUserContext();

  return (
    <View style={styles.listContainer}>
      <FlatList
        keyExtractor={() => getKey()}
        data={user ? user.tasks : []}
        renderItem={TaskList}
        ListHeaderComponent={() => <TaskForm />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: '86.5%'
  }
});

export default TaskSummary;
