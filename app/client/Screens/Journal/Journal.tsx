import React, { useState } from 'react';
import AwesomeButton from 'react-native-really-awesome-button';
import { View, TextInput, StyleSheet, Text, ImageBackground } from 'react-native';
import { format } from 'date-fns';
import IconA from 'react-native-vector-icons/Ionicons';

const Journal = () => {
  const bgImage = require('../../../assets/blue-gradient.png');

  const [ journal, setJournal ] = useState('');
  const [ date ] = useState(format(new Date(), 'MMMM do y'))

  return (
    <ImageBackground style={styles.backgroundImage} source={bgImage}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.header}> User's Journal </Text>
          <AwesomeButton
            backgroundColor={'#1D426D'}
            textColor={'#FAFAFA'}
            height={35}
            width={125}
            raiseLevel={0}
            borderRadius={8}
            style={styles.button}
            onPress={() => {
              setJournal('');
            }}
          >
          Clear Entry
          </AwesomeButton>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 20 }}>
          <IconA name="caret-back" size={35} color="#1D426D" />
          <IconA name="caret-forward" size={35} color="#1D426D" />
        </View>
        <View style={styles.textAreaContainer} >
          <Text style={styles.date}>{date}</Text>
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholder="Type something"
            numberOfLines={10}
            multiline={true}
            onChangeText={setJournal}
            value={journal}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    marginRight: 20
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 65,
  },
  date: {
    color: '#1D426D',
    fontSize: 14,
    alignSelf: 'flex-end'
  },
  header: {
    color: '#1D426D',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20
  },
  textArea: {
    height: '82%',
    width: 350,
    justifyContent: 'flex-start'
  },
  textAreaContainer: {
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  }
});

export default Journal;