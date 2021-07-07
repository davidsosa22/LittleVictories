import ProgressBar from '../Root/ProgressBar';
import CurrentJournal from './CurrentJournal';
import PastJournals from './PastJournals';
import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { useUserContext } from '../../Contexts/userContext';
import { containerStyles } from '../../Stylesheets/Stylesheet';

const Journals = () => {
  const bgImage = require('../../../assets/images/blue-gradient.png');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttons = ['Current', 'Previous'];
  const { user } = useUserContext();

  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  return (
    <ImageBackground style={containerStyles.backgroundImage} source={bgImage}>
      <ProgressBar />
      <SafeAreaView>
        <ButtonGroup
          onPress={updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{
            height: 40,
            borderRadius: 10,
            borderColor: '#5c83b1',
            marginTop: 20,
            marginRight: 40,
            marginLeft: 40
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
        {selectedIndex === 0 ? (
          <CurrentJournal />
        ) : (
          <View>
            <PastJournals />
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Journals;
