import React from 'react';
import {
  Text,
  Button,
  View,
  FlatList,
  TextInput,
  StyleSheet
} from 'react-native';

import { useUserContext } from '../../Contexts/userContext';
import { useSocketContext } from '../../Contexts/socketContext';
import { useFeedContext } from '../../Contexts/feedContext';
import Comment from './Comment';

import axios from 'axios';
import { v4 as getKey } from 'uuid';

const FeedItem = ({
  username,
  description,
  completed_at,
  id,
  likes,
  comments
}) => {
  const { user, setUser } = useUserContext();
  const { feed, setFeed } = useFeedContext();
  const { socket } = useSocketContext();

  const [showCommentInput, setShowCommentInput] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');

  const addLike = async (taskId: number): Promise<void> => {
    const { data: newLike } = await axios.post(
      'http://localhost:3000/api/likes/',
      {
        userId: user.id,
        taskId
      }
    );
    if (newLike) {
      const mappedFeed = feed.map((feedItem) => {
        if (feedItem.id === id) {
          return { ...feedItem, likes: [...feedItem.likes, newLike] };
        }
        return feedItem;
      });
      setFeed(mappedFeed);
      socket.emit('addLike', newLike);
    }
  };

  const removeLike = async (taskId: number): Promise<void> => {
    const { data: removeSuccessful } = await axios.delete(
      `http://localhost:3000/api/likes/${user.id}/${taskId}`
    );
    if (removeSuccessful) {
      const mappedFeed = feed.map((feedItem) => {
        if (feedItem.id === id) {
          const filteredLikes = feedItem.likes.filter((like) => {
            return !(like.task_id === taskId && like.user_id === user.id);
          });
          return { ...feedItem, likes: filteredLikes };
        }
        return feedItem;
      });
      setFeed(mappedFeed);
      socket.emit('removeLike', taskId);
    }
  };

  const addComment = async (): Promise<void> => {
    const { data: newComment } = await axios.post(
      'http://localhost:3000/api/comments',
      {
        user_id: user.id,
        task_id: id,
        content: commentText
      }
    );
    if (newComment) {
      const mappedFeed = feed.map((feedItem) => {
        if (feedItem.id === id) {
          return { ...feedItem, comments: [...feedItem.comments, newComment] };
        }
        return feedItem;
      });
      setFeed(mappedFeed);
      socket.emit('addComment', newComment);
    }
  };

  const removeComment = async (commentId: number): Promise<void> => {
    const { data: removeSuccessful } = await axios.delete(
      `http://localhost:3000/api/comments/${commentId}`
    );
    if (removeSuccessful) {
      const mappedFeed = feed.map((feedItem) => {
        if (feedItem.id === id) {
          const filteredComments = feedItem.comments.filter((comment) => {
            return comment.id !== commentId;
          });
          return { ...feedItem, comments: filteredComments };
        }
        return feedItem;
      });
      setFeed(mappedFeed);
      socket.emit('removeComment', id);
    }
  };

  const canLike = () => {
    if (user?.id) {
      return likes?.reduce((canLike, like) => {
        if (like.user_id === user.id) {
          return false;
        }
        return canLike;
      }, true);
    }
  };

  return (
    <View style={styles.feedItemContainer}>
      <Text
        style={user.readable_font ? styles.boldTextLarger : styles.boldText}
      >
        {username}
      </Text>
      <Text style={user.readable_font ? styles.textLarger : styles.text}>
        {description}
      </Text>
      <Text style={user.readable_font ? styles.textLarger : styles.text}>
        {completed_at}
      </Text>
      <Text style={user.readable_font ? styles.textLarger : styles.text}>
        {likes?.length} likes
      </Text>
      <View style={styles.btnContainer}>
        {username !== user.username && (
          <Button
            title={`${canLike() ? 'Add Like' : 'Remove Like'}`}
            onPress={() => (canLike() ? addLike(id) : removeLike(id))}
          />
        )}
        {username !== user.username && (
          <Button
            title='Comment'
            onPress={() => setShowCommentInput(!showCommentInput)}
          />
        )}
      </View>
      {comments?.length ? (
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <Comment {...item} removeComment={removeComment} />
          )}
          keyExtractor={() => getKey()}
        />
      ) : null}
      {showCommentInput && (
        <View>
          <TextInput
            style={
              user.readable_font ? styles.textInputLarger : styles.textInput
            }
            onChangeText={setCommentText}
            value={commentText}
          />
          <Button
            title='Submit'
            onPress={() => {
              if (commentText.length) {
                addComment();
              }
            }}
          />
          <Button
            title='Cancel'
            onPress={() => {
              setCommentText('');
              setShowCommentInput(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  feedItemContainer: {
    backgroundColor: '#8ebac6',
    padding: 20,
    margin: 15,
    width: 335,
    borderRadius: 10
  },
  btnContainer: {
    flexDirection: 'row'
  },
  boldText: {
    fontSize: 18,
    color: '#1D426D',
    fontWeight: 'bold'
  },
  boldTextLarger: {
    fontSize: 20,
    color: '#1D426D',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 18,
    color: '#1D426D'
  },
  textLarger: {
    fontSize: 20,
    color: '#1D426D'
  },
  textInput: {
    width: '100%',
    padding: 10,
    backgroundColor: '#9ec5cf',
    fontSize: 18,
    color: '#1D426D'
  },
  textInputLarger: {
    width: '100%',
    padding: 10,
    backgroundColor: '#9ec5cf',
    fontSize: 20,
    color: '#1D426D'
  }
});

export default FeedItem;
