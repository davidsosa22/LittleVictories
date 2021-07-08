import React, { ReactElement } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { v4 as getKey } from 'uuid';
import { useFeedContext } from '../../Contexts/feedContext';
import FeedItem from './FeedItem';

const FeedView = () : ReactElement => {
  const { feed } = useFeedContext();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        marginLeft: 20,
        marginRight: 20,
        width: '100%'
      }}
    >
      <Text style={styles.heading}>Feed</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={feed}
          renderItem={({ item }) => <FeedItem {...item} />}
          keyExtractor={() => getKey()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#1D426D',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 25,
    marginLeft: 20
  },
  listContainer: {
    height: '88%'
  }
});

export default FeedView;
