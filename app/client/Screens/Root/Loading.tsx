import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { useQuoteContext } from '../../Contexts/quoteContext';

const Loading = () => {
  const bgImage = require('../../../assets/images/blue-gradient.png');
  const { quote, author } = useQuoteContext();

  return (
    <ImageBackground style={styles.backgroundImage} source={bgImage}>
      <Text style={styles.quote}>"{quote.trim()}"</Text>
      <Text style={styles.author}>{author.trim()}</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  author: {
    fontSize: 20,
    color: '#1D426D',
    marginLeft: 55,
    marginRight: 55,
    marginTop: 5,
    textAlign: 'center'
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  quote: {
    fontSize: 20,
    color: '#1D426D',
    marginLeft: 55,
    marginRight: 55,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Loading;
