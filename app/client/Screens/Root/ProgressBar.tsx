import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { useUserContext } from '../../Contexts/userContext';

const ProgressBar = () => {
  const { user } = useUserContext();
  if (!user) {
    return <View></View>;
  }
  const { points, level, username } = user;
  return (
    <View style={styles.topNav}>
      <View style={{ flexDirection: 'column' }}>
        <Text
          style={user.readable_font ? styles.toptextLarger : styles.toptext}
        >
          {username}{' '}
        </Text>
        <Text style={user.readable_font ? styles.textLarger : styles.text}>
          Level {level | 0}{' '}
        </Text>
      </View>
      <Progress.Bar
        animated={true}
        indeterminateAnimationDuration={500}
        progress={points / 250}
        width={210}
        height={17}
        borderRadius={5}
        style={styles.progressBar}
      />
      <Text style={user.readable_font ? styles.pointsLarger : styles.points}>
        {' '}
        {user.points}/250
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  points: {
    color: '#FAFAFA',
    marginTop: 47,
    fontSize: 16
  },
  pointsLarger: {
    color: '#FAFAFA',
    marginTop: 47,
    fontSize: 18
  },
  progressBar: {
    marginBottom: 20,
    marginTop: 50,
    marginRight: 10,
    marginLeft: 10
  },
  text: {
    color: '#FAFAFA',
    fontSize: 16
  },
  textLarger: {
    color: '#FAFAFA',
    fontSize: 18
  },
  topNav: {
    flexDirection: 'row',
    backgroundColor: '#3E6592',
    width: '100%',
    height: '11%',
    justifyContent: 'center'
  },
  toptext: {
    color: '#FAFAFA',
    marginTop: 40,
    fontSize: 16
  },
  toptextLarger: {
    color: '#FAFAFA',
    marginTop: 40,
    fontSize: 18
  }
});

export default ProgressBar;
