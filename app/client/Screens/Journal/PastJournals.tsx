import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { useJournalContext } from '../../Contexts/journalContext';
import moment from 'moment';
import { v4 as getKey } from 'uuid';
import { useUserContext } from '../../Contexts/userContext';
import { textStyles } from '../../Stylesheets/Stylesheet';

const Journal = () => {
  const { journals } = useJournalContext();
  const { user } = useUserContext();

  // const clearJournal = () => {
  //   Alert.alert(
  //     'Are you sure?',
  //     'Once deleted, you cannot get this journal entry back.',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Clear Entry',
  //         onPress: async () => {
  //           await axios.post(
  //             'http://localhost:3000/api/journalEntries/create',
  //             {
  //               user_id: user.id,
  //               content: '',
  //               date: format(new Date(), 'MM-dd-yyyy'),
  //             }
  //           );
  //           // shift
  //           setText('');
  //           alert('Journal successfully cleared.');
  //         },
  //       },
  //     ]
  //   );
  // };

  const list = () => {
    return (
      <View>
        {journals ? (
          <FlatList
            keyExtractor={() => getKey()}
            data={journals.filter((journal) => {
              return journal.date < moment().format('MM-D-Y');
            })}
            renderItem={({ item: journal }) => {
              return (
                <View style={styles.textAreaContainer}>
                  <Text
                    style={user.readable_font ? styles.dateLarger : styles.date}
                  >
                    {journal.date}
                  </Text>
                  <Text
                    style={
                      user.readable_font ? textStyles.text_big : textStyles.text
                    }
                  >
                    {journal.content}
                  </Text>
                </View>
              );
            }}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View>
      <Text style={user.readable_font ? styles.headerLarger : styles.header}>
        Previous Journals
      </Text>
      {list()}
    </View>
  );
};

const styles = StyleSheet.create({
  date: {
    color: '#1D426D',
    fontSize: 18,
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  dateLarger: {
    color: '#1D426D',
    fontSize: 18,
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  header: {
    color: '#1D426D',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 40,
    marginTop: 20
  },
  headerLarger: {
    color: '#1D426D',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 40,
    marginTop: 20
  },
  textAreaContainer: {
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    padding: 20,
    marginTop: 20
  }
});

export default Journal;
