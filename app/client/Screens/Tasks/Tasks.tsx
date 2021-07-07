import ProgressBar from '../Root/ProgressBar';
import TaskSummary from './TaskSummary';
import HabitSummary from './HabitSummary';
import React, { useState } from 'react';
import { ImageBackground, SafeAreaView } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { containerStyles } from '../../Stylesheets/Stylesheet';
import { useUserContext } from '../../Contexts/userContext';

const Tasks = () => {
  const bgImage = require('../../../assets/images/blue-gradient.png');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttons = ['Tasks', 'Habits'];
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
            marginLeft: 40,
            marginRight: 40,
            marginTop: 20
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
        {selectedIndex === 0 ? <TaskSummary /> : <HabitSummary />}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Tasks;
