import React, { ReactElement, useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import { useUserContext } from '../../Contexts/userContext';
import { useJournalContext } from '../../Contexts/journalContext';
import moment from 'moment';
import { textStyles } from '../../Stylesheets/Stylesheet';
import { Button } from 'react-native-elements';

const Journal = (): ReactElement => {
  const { user } = useUserContext();
  const { journal, setJournal } = useJournalContext();
  const [date] = useState(moment().format('MMMM Do Y'));

  const saveJournal = async (): Promise<void> => {
    await axios.post(
      'http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/journalEntries/create',
      {
        user_id: user.id,
        content: journal.content,
        date: moment().format('MM-D-Y')
      }
    );

    alert('Journal successfully saved.');
  };

  const clearJournal = (): void => {
    Alert.alert(
      'Are you sure?',
      'Once deleted, you cannot get this journal entry back.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Entry',
          onPress: async () => {
            await axios.delete(
              `http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/journalEntries/${
                user.id
              }/${moment().format('MM-D-Y')}`
            );
            setJournal('');
            alert('Journal successfully cleared.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.main}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Text style={user.readable_font ? textStyles.h1_big : textStyles.h1}>
          User's Journal{' '}
        </Text>
        <Button
          title='Clear Entry'
          buttonStyle={styles.button}
          titleStyle={
            user.readable_font
              ? textStyles.buttonText_big
              : textStyles.buttonText
          }
          onPress={() => {
            clearJournal();
          }}
        />
      </View>
      <View style={styles.textAreaContainer}>
        <Text style={user.readable_font ? styles.dateLarger : styles.date}>
          {date}
        </Text>
        <TextInput
          style={user.readable_font ? styles.textAreaLarger : styles.textArea}
          placeholder='Type something'
          numberOfLines={10}
          multiline={true}
          onChangeText={(text) => setJournal({ ...journal, content: text })}
          value={journal?.content || ''}
          editable={true}
        />
      </View>
      <Button
        title='Save'
        buttonStyle={[styles.button, styles.submit]}
        titleStyle={
          user.readable_font ? textStyles.buttonText_big : textStyles.buttonText
        }
        onPress={() => {
          saveJournal();
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#1D426D',
    borderRadius: 10
  },
  date: {
    color: '#1D426D',
    fontSize: 18,
    alignSelf: 'flex-end'
  },
  dateLarger: {
    color: '#1D426D',
    fontSize: 20,
    alignSelf: 'flex-end'
  },
  header: {
    color: '#1D426D',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20
  },
  main: {
    padding: 40
  },
  submit: {
    alignSelf: 'flex-end',
    marginTop: 10
  },
  textArea: {
    height: '69%',
    justifyContent: 'flex-start',
    marginTop: 5,
    color: '#1D426D',
    fontSize: 18
  },
  textAreaLarger: {
    height: '69%',
    justifyContent: 'flex-start',
    marginTop: 5,
    color: '#1D426D',
    fontSize: 20
  },
  textAreaContainer: {
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    padding: 20,
    marginTop: 20
  }
});

export default Journal;
