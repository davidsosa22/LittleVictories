import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import { FAB } from 'react-native-paper';
import { useUserContext } from '../../Contexts/userContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Button, ButtonGroup } from 'react-native-elements';
import { textStyles } from '../../Stylesheets/Stylesheet';
import { Habit } from '../../Interfaces/user';

const TaskForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const { user, setUser } = useUserContext();
  const [date, setDate] = useState(new Date());
  const [selectedFrequencyIndex, setSelectedFrequencyIndex] = useState(0);
  const [selectedDayIndices, setSelectedDayIndices] = useState([]);

  const daysSelected = (selectedDayIndices: number[]): string => {
    const days: string[] = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
    let dayStr: string = '';
    for (let i: number = 0; i < selectedDayIndices.length; i++) {
      dayStr = dayStr + days[selectedDayIndices[i]];
    }
    return dayStr;
  };

  const handleSubmit = async (): Promise<any> => {
    const frequencies: string[] = ['daily', 'weekly', 'monthly'];
    try {
      const { data: habit }: AxiosResponse<Habit> = await axios.post(
        'http://localhost:3000/api/habits/',
        {
          user_id: user.id,
          description: description,
          frequency: frequencies[selectedFrequencyIndex],
          days_of_week: daysSelected(selectedDayIndices),
          calendar_date: parseInt(format(date, 'dd'))
        }
      );
      const habitArr: Habit[] = [...user.habits, habit];
      setUser({
        ...user,
        habits: habitArr
      });
      setShowForm(false);
      setDescription('');
      setDate(new Date());
      setSelectedFrequencyIndex(0);
      setSelectedDayIndices([]);
    } catch (err) {
      console.warn('error with post habit: ', err);
    }
  };

  // event needs to stay, breaks date picker without it
  const onChange = (event, selectedDate): void => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const dayArr: string[] = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 20
        }}
      >
        <Text style={user.readable_font ? textStyles.h1_big : textStyles.h1}>
          Habits
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{ flexDirection: 'column', alignItems: 'center' }}
          ></View>
          <Text> </Text>
          <FAB
            style={styles.fab}
            small
            icon='plus'
            onPress={() => setShowForm(true)}
          />
        </View>
      </View>
      {showForm ? (
        <View style={styles.addHabitComponent}>
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
                Add Habit
              </Text>
              <Button
                title='Cancel'
                buttonStyle={{ width: 80, borderRadius: 10 }}
                onPress={() => setShowForm(false)}
              />
            </View>
            <TextInput
              style={user.readable_font ? styles.inputLarger : styles.input}
              onChangeText={setDescription}
              value={description}
              placeholder='Enter Habit Description'
              autoCapitalize='none'
            />
          </View>
          <Text
            style={user.readable_font ? styles.promptLarger : styles.prompt}
          >
            Habit Frequency
          </Text>
          <ButtonGroup
            onPress={setSelectedFrequencyIndex}
            selectedIndex={selectedFrequencyIndex}
            buttons={['daily', 'weekly', 'monthly']}
            containerStyle={{
              height: 40,
              borderRadius: 10,
              borderColor: '#5c83b1',
              marginLeft: 0,
              marginRight: 0
            }}
            selectedButtonStyle={{
              backgroundColor: '#5c83b1',
              borderColor: '#5c83b1'
            }}
            buttonStyle={{ backgroundColor: '#1D426D', borderColor: '#5c83b1' }}
            textStyle={
              user.readable_font
                ? { fontSize: 18, color: '#ada6a6' }
                : { fontSize: 16, color: '#ada6a6' }
            }
            innerBorderStyle={{ color: '#1D426D' }}
          />
          {selectedFrequencyIndex === 1 ? (
            <View>
              <Text
                style={user.readable_font ? styles.promptLarger : styles.prompt}
              >
                Habit Day(s)
              </Text>
              <ButtonGroup
                onPress={setSelectedDayIndices}
                selectedIndexes={selectedDayIndices}
                buttons={dayArr}
                containerStyle={{
                  height: 40,
                  borderRadius: 5,
                  borderColor: '#5c83b1'
                }}
                selectedButtonStyle={{
                  backgroundColor: '#5c83b1',
                  borderColor: '#5c83b1'
                }}
                buttonStyle={{
                  backgroundColor: '#1D426D',
                  borderColor: '#5c83b1'
                }}
                textStyle={
                  user.readable_font
                    ? { fontSize: 18, color: '#ada6a6' }
                    : { fontSize: 16, color: '#ada6a6' }
                }
                innerBorderStyle={{ color: '#1D426D' }}
                selectMultiple={true}
              />
            </View>
          ) : null}
          {selectedFrequencyIndex === 2 ? (
            <View>
              <Text
                style={user.readable_font ? styles.promptLarger : styles.prompt}
              >
                Monthly Repeat Date
              </Text>
              <DateTimePicker
                testID='dateTimePicker'
                value={date}
                display='default'
                onChange={onChange}
              />
            </View>
          ) : null}
          <Button
            buttonStyle={{
              width: 80,
              alignSelf: 'flex-end',
              marginTop: 15,
              borderRadius: 10
            }}
            title='Submit'
            onPress={() => handleSubmit()}
          />
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  addHabitComponent: {
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
  input: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 15,
    fontSize: 16
  },
  inputLarger: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 15,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5
  },
  textArea: {
    height: 200,
    width: 100,
    justifyContent: 'flex-start'
  }
});
export default TaskForm;
