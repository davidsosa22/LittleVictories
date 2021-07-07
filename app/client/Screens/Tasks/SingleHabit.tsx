import axios from 'axios';
import { View, StyleSheet, Text } from 'react-native';
import { useUserContext } from '../../Contexts/userContext';
import React, { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { format } from 'date-fns';

const SingleHabit = ({ item }) => {
  const { user, setUser } = useUserContext();
  const [finished, setFinished] = useState(item.is_complete);
  const [removed, setRemoved] = useState(false);

  const markHabitComplete = async () => {
    try {
      const {
        data: { points, level }
      } = await axios.patch(
        `http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/habits/${item.id}/complete`
      );
      const mappedHabits = user.habits.map((habit) => {
        if (habit.id === item.id) {
          return { ...habit, is_complete: true };
        }
        return habit;
      });
      setUser({ ...user, habits: mappedHabits, points, level });
    } catch (err) {
      console.warn('client-side complete habit error: ', err);
    }
  };

  const markHabitIncomplete = async () => {
    try {
      const {
        data: { points, level }
      } = await axios.patch(
        `http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/habits/${item.id}/incomplete`
      );
      const mappedHabits = user.habits.map((habit) => {
        if (habit.id === item.id) {
          return { ...habit, is_complete: false };
        }
        return habit;
      });
      setUser({ ...user, habits: mappedHabits, points, level });
    } catch (err) {
      console.warn('client-side error marking habit incomplete, error: ', err);
    }
  };

  const removeHabit = async () => {
    try {
      await axios.delete(
        `http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/habits/${item.id}`
      );
      const filteredHabits = user.habits.filter((habit) => {
        return habit.id !== item.id;
      });
      setUser({ ...user, habits: filteredHabits });
    } catch (error) {
      console.warn('client side remove habit error', error);
    }
  };

  const splitDays = (daysStr: string) => {
    let daysSpacedStr: string = '';
    if (daysStr.includes('M')) {
      daysSpacedStr += 'Mon, ';
    }
    if (daysStr.includes('Tu')) {
      daysSpacedStr += 'Tues, ';
    }
    if (daysStr.includes('W')) {
      daysSpacedStr += 'Wed, ';
    }
    if (daysStr.includes('Th')) {
      daysSpacedStr += 'Thurs, ';
    }
    if (daysStr.includes('F')) {
      daysSpacedStr += 'Fri, ';
    }
    if (daysStr.includes('Sa')) {
      daysSpacedStr += 'Sat, ';
    }
    if (daysStr.includes('Su')) {
      daysSpacedStr += 'Sun, ';
    }
    return daysSpacedStr.slice(0, -2);
  };

  return (
    <View style={styles.habit_view}>
      <View style={{ flexDirection: 'row' }}>
        <CheckBox
          checked={finished}
          onPress={() => {
            setFinished(!finished);
            finished ? markHabitIncomplete() : markHabitComplete();
          }}
        />
        <View style={{ flexDirection: 'column' }}>
          <Text style={user.readable_font ? styles.textLarger : styles.text}>
            {item.description}
          </Text>
          <Text style={user.readable_font ? styles.textLarger : styles.text}>
            Frequency: {item.frequency}
          </Text>
          {item.frequency === 'weekly' ? (
            <Text style={user.readable_font ? styles.textLarger : styles.text}>
              On {splitDays(item.days_of_week)}
            </Text>
          ) : null}
          {item.frequency === 'monthly' ? (
            <Text style={user.readable_font ? styles.textLarger : styles.text}>
              Due Date: {format(new Date(), 'MMMM')} {item.calendar_date}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{ width: '100%', alignItems: 'flex-end' }}>
        <CheckBox
          containerStyle={{
            width: 115,
            backgroundColor: '#8ebac6',
            margin: 0,
            borderColor: '#8ebac6'
          }}
          textStyle={{ color: '#1D426D', fontWeight: 'normal' }}
          right
          title='Delete Habit'
          iconRight
          iconType='material'
          uncheckedIcon='clear'
          uncheckedColor='red'
          checkedIcon='clear'
          checkedColor='black'
          checked={removed}
          onPress={() => {
            removeHabit();
            setRemoved(true);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  habit_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 40,
    marginRight: 40,
    marginTop: 10,
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 20,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  text: {
    fontSize: 18,
    color: '#1D426D',
    maxWidth: 250
  },
  textLarger: {
    fontSize: 20,
    color: '#1D426D',
    maxWidth: 250
  }
});

export default SingleHabit;
