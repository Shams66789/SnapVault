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
import DefaultImage1 from '../assets/google-png.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
const DEFAULT_IMAGE1 = Image.resolveAssetSource(DefaultImage1).uri;

const UserSetUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeForm, setActiveForm] = useState('signIn');
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSwitch = form => {
    setActiveForm(form);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
            onPress={() => handleFormSwitch('signIn')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              activeForm === 'signUp' && styles.activeButton,
            ]}
            onPress={() => handleFormSwitch('signUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {activeForm === 'signIn' ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter Email or Username"
              placeholderTextColor={'#000'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={'#000'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.oRText}>-OR-</Text>

            <Image source={{uri: DEFAULT_IMAGE1}} style={styles.googleButton} />
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={'#000'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Create a Password"
                placeholderTextColor={'#000'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password" 
                placeholderTextColor={'#000'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignUp}>
              <Text style={styles.submitButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.oRText}>-OR-</Text>

            <Image source={{uri: DEFAULT_IMAGE1}} style={styles.googleButton} />
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
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 14,
    height: 55,
    fontFamily: 'inter_regular',
    padding: 10,
    borderColor: '#000', // Set the border color here
    borderWidth: 1,
    borderRadius: 10,

    marginBottom: 15,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  submitButton: {
    backgroundColor: '#f45b69',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
  oRText: {
    color: '#000',
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'inter_semi_bold',
    textAlign: 'center', // Add this line to center the text horizontally
    width: '100%', // Make sure it takes the full width of the container
  },
  googleButton: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default UserSetUp;
