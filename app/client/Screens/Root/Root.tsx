import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import BottomTabs from './NavBar';
import Login from './Login';
import { useQuoteContext } from '../../Contexts/quoteContext';
import { View, Image, ImageBackground, StyleSheet } from 'react-native';
import Loading from './Loading';

const AppNavigation = createStackNavigator();

const RootNavigator = () => {
  const bgImage = require('../../../assets/images/blue-gradient.png');
  const logo = require('../../../assets/logo.png');
  const { quote } = useQuoteContext();
  if (!quote) {
    return (
      <ImageBackground style={styles.backgroundImage} source={bgImage}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            source={logo}
            style={{ resizeMode: 'contain', width: '60%', height: '50%' }}
          />
        </View>
      </ImageBackground>
    );
  }
  return (
    <NavigationContainer>
      <AppNavigation.Navigator
        mode='modal'
        initialRouteName='login'
        screenOptions={{
          header: () => null
        }}
      >
        {/* eslint-disable-next-line react/no-children-prop */}
        <AppNavigation.Screen name='index' children={BottomTabs} />
        <AppNavigation.Screen name='login' component={Login} />
        <AppNavigation.Screen name='loading' component={Loading} />
      </AppNavigation.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default RootNavigator;
