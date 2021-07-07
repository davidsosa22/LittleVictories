import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Button,
  Switch
} from 'react-native';
import axios from 'axios';
import { FAB } from 'react-native-paper';
import { useUserContext } from '../../Contexts/userContext';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { isBefore } from 'date-fns';
import Tasks from './Tasks';
const TaskForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [timeToComplete, setTimeToComplete] = useState(0);
  const [isImportant, setIsImportant] = useState(false);
  const { user, setUser } = useUserContext();
  //for date selector
  const [date, setDate] = useState(new Date());
  const toggleSwitch = () => setIsImportant((previousState) => !previousState);
  const isPast = (date: Date) => {
    if (new Date(date).getFullYear() < new Date().getFullYear()) return true;
    if (new Date(date).getFullYear() > new Date().getFullYear()) return false;
    if (new Date(date).getMonth() < new Date().getMonth()) return true;
    if (new Date(date).getMonth() > new Date().getMonth()) return false;
    if (new Date(date).getDate() < new Date().getDate()) return true;
    if (new Date(date).getDate() >= new Date().getDate()) return false;
  };
  const handleSubmit = async () => {
    if (isPast(date)) {
      alert('this date is in the past, please select a future date.');
    } else {
      const { data: task } = await axios.post(
        'http://localhost:3000/api/tasks/',
        {
          user_id: user.id,
          description,
          due_date: date,
          minutes_to_complete: timeToComplete,
          is_important: isImportant
        }
      );
      const sortedTasks = [...(user?.tasks || []), task].sort((t1, t2) =>
        isBefore(new Date(t1.due_date), new Date(t2.due_date)) ? -1 : 1
      );
      setShowForm(false);
      setDescription('');
      setDate(new Date());
      setTimeToComplete(5);
      setIsImportant(false);
      setUser({
        ...user,
        tasks: sortedTasks
      });
    }
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={user.readable_font ? styles.headerLarger : styles.header}>
          Tasks
        </Text>
        <FAB
          style={styles.fab}
          small
          icon='plus'
          onPress={() => setShowForm(true)}
        />
      </View>
      {showForm ? (
        <View style={styles.addTaskComponent}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Text
                style={
                  user.readable_font ? styles.subheaderLarger : styles.subheader
                }
              >
                Add Task
              </Text>
              <Button title='Cancel' onPress={() => setShowForm(false)} />
            </View>
            <TextInput
              style={user.readable_font ? styles.inputLarger : styles.input}
              onChangeText={setDescription}
              value={description}
              placeholder='Enter Task Description'
              autoCapitalize='none'
            />
            <View>
              <Text
                style={user.readable_font ? styles.promptLarger : styles.prompt}
              >
                Set Due Date:
              </Text>
              <DateTimePicker
                testID='dateTimePicker'
                value={date}
                display='default'
                onChange={onChange}
              />
            </View>
          </View>
          <View>
            <Text
              style={user.readable_font ? styles.promptLarger : styles.prompt}
            >
              How long will it take to complete this task?
            </Text>
            <Text style={user.readable_font ? styles.textLarger : styles.text}>
              {timeToComplete} minutes
            </Text>
            <Slider
              step={5}
              minimumValue={5}
              maximumValue={60}
              value={timeToComplete}
              onValueChange={setTimeToComplete}
              minimumTrackTintColor='#1fb28a'
              maximumTrackTintColor='#fafafa'
              thumbTintColor='#b9e4c9'
            />
          </View>
          <View
            style={
              user.readable_font ? styles.importantLarger : styles.important
            }
          >
            <Text
              style={
                user.readable_font
                  ? {
                      fontSize: 20,
                      color: '#1D426D',
                      paddingRight: 15,
                      paddingTop: 2
                    }
                  : {
                      fontSize: 18,
                      color: '#1D426D',
                      paddingRight: 15,
                      paddingTop: 2
                    }
              }
            >
              Mark task as important?
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={'#FAFAFA'}
              onValueChange={toggleSwitch}
              value={isImportant}
            />
          </View>
          <Button title='Submit' onPress={() => handleSubmit()} />
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  addTaskComponent: {
    backgroundColor: '#8ebac6',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20
  },
  container: {
    flex: 1,
    padding: 20
  },
  fab: {
    backgroundColor: '#1D426D',
    height: 40,
    marginRight: 20
  },
  header: {
    color: '#1D426D',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20
  },
  headerLarger: {
    color: '#1D426D',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20
  },
  important: {
    flexDirection: 'row',
    color: '#1D426D',
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18
  },
  importantLarger: {
    flexDirection: 'row',
    color: '#1D426D',
    marginTop: 25,
    marginBottom: 10,
    fontSize: 20
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 10,
    fontSize: 16
  },
  inputLarger: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 10,
    fontSize: 18
  },
  prompt: {
    alignSelf: 'flex-start',
    color: '#1D426D',
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18
  },
  promptLarger: {
    alignSelf: 'flex-start',
    color: '#1D426D',
    marginTop: 25,
    marginBottom: 10,
    fontSize: 20
  },
  subheader: {
    color: '#1D426D',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5
  },
  subheaderLarger: {
    color: '#1D426D',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5
  },
  submitButton: {
    marginTop: 20
  },
  text: {
    color: '#1D426D',
    marginBottom: 10,
    fontSize: 16
  },
  textLarger: {
    color: '#1D426D',
    marginBottom: 10,
    fontSize: 18
  },
  textArea: {
    height: 200,
    width: 100,
    justifyContent: 'flex-start'
  }
});
export default TaskForm;
