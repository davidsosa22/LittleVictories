import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image
} from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';

import { useUserContext } from '../../Contexts/userContext';
import { useSocketContext } from '../../Contexts/socketContext';

import axios from 'axios';
import { containerStyles } from '../../Stylesheets/Stylesheet';

const Login = ({ navigation }) => {
  const { setUser, setUserStat } = useUserContext();
  const { socket } = useSocketContext();

  const bgImage = require('../../../assets/images/blue-gradient.png');
  const logo = require('../../../assets/logo.png');

  const [username, setUsername] = useState('');
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [passwordAttempt2, setPasswordAttempt2] = useState('');
  const [loginSelected, toggleLogin] = useState(true);
  const [mismatchPasswords, setMismatchPasswords] = useState(false);
  const [wrongLogin, toggleWrongLogin] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const handleClick = (view) => {
    if (view === 'login') {
      toggleLogin(true);
      toggleWrongLogin(false);
      setUsername('');
      setPasswordAttempt('');
    } else {
      toggleLogin(false);
      setMismatchPasswords(false);
      setUsername('');
      setPasswordAttempt('');
      setPasswordAttempt2('');
    }
  };

  const handleLogin = async () => {
    if (!username.length || !passwordAttempt.length) {
      return;
    }
    if (loginSelected) {
      // attempt a login for the user
      const { data: userObj } = await axios.post(
        'http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/auth/login',
        {
          username,
          password: passwordAttempt
        }
      );
      if (userObj) {
        // if successful navigate to home
        setTimeout(() => {
          setUser(userObj);
          setUserStat(userObj.userStat);
          navigation.navigate('index');
        }, 5000);
        setUsername('');
        setPasswordAttempt('');
        socket.emit('loggedIn', userObj.id);
        navigation.navigate('loading');
      } else {
        toggleWrongLogin(true);
      }
    } else if (!loginSelected) {
      if (
        !username.length ||
        !passwordAttempt.length ||
        !passwordAttempt2.length ||
        passwordAttempt !== passwordAttempt2
      ) {
        if (passwordAttempt !== passwordAttempt2) {
          setMismatchPasswords(true);
          setUserExists(false);
        }
        return;
      }
      const { data: user } = await axios.post(
        'http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com/api/auth/register',
        {
          username,
          password: passwordAttempt
        }
      );
      // compare the two passwords
      if (user) {
        // if they match, create a new user
        // then navigate to home
        setUser(user);
        setUsername('');
        setPasswordAttempt('');
        setPasswordAttempt2('');
        navigation.navigate('index');
      } else {
        setUserExists(true);
        setMismatchPasswords(false);
        setPasswordAttempt('');
        setPasswordAttempt2('');
      }
    }
  };

  // default view or if login btn is clicked
  if (loginSelected) {
    return (
      <ImageBackground style={containerStyles.backgroundImage} source={bgImage}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <>
            <Image
              source={logo}
              style={{ resizeMode: 'contain', width: '50%', height: '25%' }}
            />
            <View style={{ flexDirection: 'row' }}>
              <AwesomeButton
                backgroundColor={'#5c83b1'}
                textColor={'#FAFAFA'}
                height={35}
                width={100}
                raiseLevel={0}
                borderRadius={8}
                style={styles.button}
                onPress={() => {
                  handleClick('login');
                }}
              >
                Login
              </AwesomeButton>
              <AwesomeButton
                backgroundColor={'#1D426D'}
                textColor={'#FAFAFA'}
                height={35}
                width={100}
                raiseLevel={0}
                borderRadius={8}
                style={styles.button}
                onPress={() => {
                  handleClick('register');
                }}
              >
                Register
              </AwesomeButton>
            </View>
            {wrongLogin ? (
              <View>
                <Text style={styles.error}>
                  Username/Password did not match an existing user.
                </Text>
                <Text style={styles.error2}>Please try again.</Text>
              </View>
            ) : null}
            <Text style={styles.text}>Username:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              autoCapitalize='none'
            />
            <Text style={styles.text}>Password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPasswordAttempt}
              value={passwordAttempt}
              secureTextEntry={true}
              autoCapitalize='none'
            />
            <AwesomeButton
              backgroundColor={'#1D426D'}
              textColor={'#FAFAFA'}
              height={35}
              width={100}
              raiseLevel={0}
              borderRadius={8}
              style={styles.button}
              onPress={() => {
                handleLogin();
              }}
            >
              Submit
            </AwesomeButton>
          </>
        </View>
      </ImageBackground>
    );
    // default view or if login btn is clicked
  } else {
    return (
      <ImageBackground style={containerStyles.backgroundImage} source={bgImage}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <>
            <Image
              source={logo}
              style={{ resizeMode: 'contain', width: '50%', height: '25%' }}
            />
            <View style={{ flexDirection: 'row' }}>
              <AwesomeButton
                backgroundColor={'#1D426D'}
                textColor={'#FAFAFA'}
                height={35}
                width={100}
                raiseLevel={0}
                borderRadius={8}
                style={styles.button}
                onPress={() => {
                  handleClick('login');
                }}
              >
                Login
              </AwesomeButton>
              <AwesomeButton
                backgroundColor={'#5c83b1'}
                textColor={'#FAFAFA'}
                height={35}
                width={100}
                raiseLevel={0}
                borderRadius={8}
                style={styles.button}
                onPress={() => {
                  handleClick('register');
                }}
              >
                Register
              </AwesomeButton>
            </View>
            <Text style={styles.text}>Username:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              autoCapitalize='none'
            />
            {mismatchPasswords ? (
              <View>
                <Text style={styles.error}>Passwords did not match</Text>
                {/* <Text style={styles.error}>or username is already taken.</Text> */}
                <Text style={styles.error2}>Please try again.</Text>
              </View>
            ) : null}
            {userExists ? (
              <View>
                {/* <Text style={styles.error}>Passwords did not match</Text> */}
                <Text style={styles.error}>Username is already taken.</Text>
                <Text style={styles.error2}>Please try again.</Text>
              </View>
            ) : null}
            <Text style={styles.text}>Password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPasswordAttempt}
              value={passwordAttempt}
              secureTextEntry={true}
              autoCapitalize='none'
            />
            <Text style={styles.text}>Confirm Password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPasswordAttempt2}
              value={passwordAttempt2}
              secureTextEntry={true}
              autoCapitalize='none'
            />
            <AwesomeButton
              backgroundColor={'#1D426D'}
              textColor={'#FAFAFA'}
              height={35}
              width={100}
              raiseLevel={0}
              borderRadius={8}
              style={styles.button}
              onPress={() => {
                handleLogin();
              }}
            >
              Submit
            </AwesomeButton>
          </>
        </View>
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20
  },
  error: {
    color: 'red',
    alignSelf: 'center'
  },
  error2: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: 15
  },
  input: {
    height: 40,
    width: '50%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    opacity: 0.3,
    marginBottom: 20
  },
  text: {
    color: '#FAFAFA',
    marginBottom: 5,
    fontSize: 16
  }
});

export default Login;
