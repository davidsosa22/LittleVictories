import React, { ReactElement, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useUserContext } from '../../Contexts/userContext';
import Loading from '../Root/Loading';
import { v4 as getKey } from 'uuid';
import ProgressBar from '../Root/ProgressBar';
import { containerStyles, textStyles } from '../../Stylesheets/Stylesheet';
import Achievements from './Achievements';
import WeeklyStats from './WeeklyStats';
import DailyReflection from './DailyReflection';

const Home = (): ReactElement => {
  const { user, userStat } = useUserContext();
  const bgImage = require('../../../assets/images/blue-gradient.png');
  const [hasStats, setHasStats] = useState(userStat || user.userStats.length);

  if (!user) {
    return <Loading />;
  }
  return (
    <ImageBackground style={containerStyles.backgroundImage} source={bgImage}>
      <ProgressBar />
      <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        <ScrollView>
          <View style={styles.view}>
            <Text
              style={[
                user.readable_font ? textStyles.h2_big : textStyles.h2,
                { marginBottom: 10 }
              ]}
            >
              Upcoming Tasks
            </Text>
            {user.tasks?.slice(0, 5).map((task) => {
              return (
                <View style={styles.task} key={getKey()}>
                  <Text
                    style={
                      user.readable_font ? textStyles.text_big : textStyles.text
                    }
                  >
                    {task.description} - {task.due_date}
                  </Text>
                </View>
              );
            })}
          </View>
          <DailyReflection setHasStats={setHasStats} />
          {hasStats ? <WeeklyStats /> : null}
          <Achievements />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  task: {
    paddingTop: 10
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
export default Home;
