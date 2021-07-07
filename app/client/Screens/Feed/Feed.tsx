import React, { ReactElement, useState } from 'react';
import { ImageBackground, SafeAreaView } from 'react-native';
import ProgressBar from '../Root/ProgressBar';
import FeedView from './FeedView';
import { ButtonGroup } from 'react-native-elements';
import Friends from './Friends';
import { containerStyles } from '../../Stylesheets/Stylesheet';

const Feed = (): ReactElement => {
  const bgImage: any = require('../../../assets/images/blue-gradient.png');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttons: string[] = ['Feed', 'Friends'];

  const updateIndex = (selectedIndex: number): void => {
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
            marginLeft: 40,
            marginRight: 40
          }}
          selectedButtonStyle={{
            backgroundColor: '#5c83b1',
            borderColor: '#5c83b1'
          }}
          buttonStyle={{ backgroundColor: '#1D426D', borderColor: '#5c83b1' }}
          textStyle={{ fontSize: 16, color: '#ada6a6' }}
          innerBorderStyle={{ color: '#1D426D' }}
        />
        {selectedIndex === 0 ? <FeedView /> : <Friends />}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Feed;
