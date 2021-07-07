import React, { useState, ReactElement } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { textStyles } from '../../Stylesheets/Stylesheet';
import { useUserContext } from '../../Contexts/userContext';
import axios from 'axios';
import { format } from 'date-fns';
import { Button, getIconType } from 'react-native-elements';
import FaceIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const DailyReflection = ({ setHasStats }): ReactElement => {
  const { user, userStat, setUserStat } = useUserContext();
  const [sleepHours, setSleepHours] = useState('');
  const [didEatWell, setDidEatWell] = useState('');
  const [didExercise, setDidExercise] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [activeIcon, setActiveIcon] = useState(null);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/stats', {
        user_id: user.id,
        sleep_hours: parseInt(sleepHours),
        eaten_well: didEatWell === 'yes',
        exercised: didExercise === 'yes',
        notes: notes,
        mood: mood,
        date: format(new Date(), 'MM-dd-yyyy')
      });
      setUserStat({
        id: data.id,
        sleep_hours: data.sleep_hours,
        eaten_well: data.eaten_well,
        exercised: data.exercised,
        notes: data.notes,
        mood: data.mood,
        date: data.date
      });
      setHasSubmitted(true);
      setHasStats(true);
    } catch (err) {
      console.warn('had issues posting stats (client)');
    }
  };

  const handleFace = (value: string) => {
    setMood(value);
    setActiveIcon(value);
  };

  const getIcon = (mood: string) => {
    const icons = {
      great: 'emoticon-excited-outline',
      good: 'emoticon-happy-outline',
      ok: 'emoticon-neutral-outline',
      bad: 'emoticon-sad-outline',
      terrible: 'emoticon-angry-outline'
    };
    return <FaceIcon name={icons[mood]} size={35} color='#FAFAFA' />;
  };

  return (
    <View style={styles.view}>
      <Text
        style={[
          user.readable_font ? textStyles.h2_big : textStyles.h2,
          { marginBottom: 10 }
        ]}
      >
        Daily Reflection
      </Text>
      {hasSubmitted || userStat ? (
        <View>
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Fill out your Daily Reflection data tomorrow for the most accurate
            Weekly Stats.
          </Text>
          <Text
            style={[
              user.readable_font ? textStyles.h3_big : textStyles.h3,
              { marginTop: 15 }
            ]}
          >
            Today's Data:
          </Text>
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Hours of sleep: {userStat?.sleep_hours || sleepHours}
          </Text>
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Did you eat well?{' '}
            {didEatWell.length
              ? didEatWell
              : userStat?.eaten_well
              ? 'yes'
              : 'no'}
          </Text>
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Exercised?{' '}
            {didExercise.length
              ? didExercise
              : userStat?.exercised
              ? 'yes'
              : 'no'}
          </Text>
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Notes: {userStat?.notes || notes}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                user.readable_font ? textStyles.text_big : textStyles.text,
                { marginTop: 10 }
              ]}
            >
              Mood:{' '}
            </Text>
            {userStat?.mood ? getIcon(userStat?.mood) : getIcon(mood)}
          </View>
        </View>
      ) : (
        <View style={{ alignItems: 'flex-start' }}>
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            How many hours did you sleep last night?
          </Text>
          <TextInput
            style={user.readable_font ? styles.inputLarger : styles.input}
            onChangeText={setSleepHours}
            value={sleepHours}
            placeholder='Enter 0 - 24'
            autoCapitalize='none'
          />
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Did you eat well?
          </Text>
          <TextInput
            style={user.readable_font ? styles.inputLarger : styles.input}
            onChangeText={setDidEatWell}
            value={didEatWell}
            placeholder='yes or no'
            autoCapitalize='none'
          />
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Did you get any exercise?
          </Text>
          <TextInput
            style={user.readable_font ? styles.inputLarger : styles.input}
            onChangeText={setDidExercise}
            value={didExercise}
            placeholder='yes or no'
            autoCapitalize='none'
          />
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            Daily Notes
          </Text>
          <View style={{ width: '100%' }}>
            <TextInput
              style={
                user.readable_font
                  ? styles.multi_inputLarger
                  : styles.multi_input
              }
              multiline
              numberOfLines={4}
              value={notes}
              maxLength={250}
              onChangeText={setNotes}
              editable={true}
              placeholder='Enter notes here.'
            />
          </View>
          <Text
            style={[
              user.readable_font ? textStyles.text_big : textStyles.text,
              { marginTop: 10 }
            ]}
          >
            What's your mood?
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <FaceIcon
              name='emoticon-angry-outline'
              onPress={() => handleFace('terrible')}
              size={35}
              style={
                activeIcon === 'terrible'
                  ? styles.activeIcon
                  : styles.inactiveIcon
              }
            />
            <FaceIcon
              name='emoticon-sad-outline'
              onPress={() => handleFace('bad')}
              size={35}
              style={
                activeIcon === 'bad' ? styles.activeIcon : styles.inactiveIcon
              }
            />
            <FaceIcon
              name='emoticon-neutral-outline'
              onPress={() => handleFace('ok')}
              size={35}
              style={
                activeIcon === 'ok' ? styles.activeIcon : styles.inactiveIcon
              }
            />
            <FaceIcon
              name='emoticon-happy-outline'
              onPress={() => handleFace('good')}
              size={35}
              style={
                activeIcon === 'good' ? styles.activeIcon : styles.inactiveIcon
              }
            />
            <FaceIcon
              name='emoticon-excited-outline'
              onPress={() => handleFace('great')}
              size={35}
              style={
                activeIcon === 'great' ? styles.activeIcon : styles.inactiveIcon
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              title='Submit'
              buttonStyle={styles.button}
              titleStyle={
                user.readable_font
                  ? textStyles.buttonText_big
                  : textStyles.buttonText
              }
              onPress={() => {
                handleSubmit();
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activeIcon: {
    color: '#FAFAFA'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1D426D'
  },
  inactiveIcon: {
    color: '#9b9a9a'
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    padding: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18
  },
  inputLarger: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    padding: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20
  },
  multi_input: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    padding: 10,
    paddingTop: 10,
    maxWidth: '100%',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18
  },
  multi_inputLarger: {
    borderRadius: 10,
    backgroundColor: '#9ec5cf',
    color: '#1D426D',
    padding: 10,
    paddingTop: 10,
    maxWidth: '100%',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20
  },
  view: {
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 20,
    padding: 20
  }
});

export default DailyReflection;
