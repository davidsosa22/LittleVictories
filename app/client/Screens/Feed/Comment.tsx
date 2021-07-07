import React from 'react';
import { useUserContext } from '../../Contexts/userContext';
import { View, Button, Text } from 'react-native';
import { textStyles } from '../../Stylesheets/Stylesheet';

const Comment = ({ id, content, user_id, username, removeComment }) => {
  const { user } = useUserContext();

  const canRemove = () => {
    if (user?.id) {
      return user_id === user.id;
    }
    return false;
  };

  return (
    <View>
      <Text style={user.readable_font ? textStyles.text_big : textStyles.text}>
        {content} -- {username}
      </Text>
      {canRemove() && (
        <Button onPress={() => removeComment(id)} title='Remove Comment' />
      )}
    </View>
  );
};

export default Comment;
