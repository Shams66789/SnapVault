import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import DefaultImage from '../assets/download.png';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;

const UserSetUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeForm, setActiveForm] = useState('signIn');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: DEFAULT_IMAGE}} style={styles.image} />
      <Text style={styles.text}>Welcome User👋</Text>

      <View style={styles.formContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              activeForm === 'signIn' && styles.activeButton,
            ]}
            onPress={() => setActiveForm('signIn')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeForm === 'signUp' && styles.activeButton,
            ]}
            onPress={() => setActiveForm('signUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {activeForm === 'signIn' ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignUp}>
              <Text style={styles.submitButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Light mode background color
  },
  text: {
    color: '#fff', // Light mode text color
    fontSize: 28,
    fontFamily: 'inter_medium',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 15,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f45b69', // Red color
    padding: 10,
    borderRadius: 10,
    margin: 10,
    flex: 1,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#d43d4e', // Darker red for active button
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    fontSize:16,
    height:55,
    fontFamily: 'inter_regular',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#f45b69',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserSetUp;
