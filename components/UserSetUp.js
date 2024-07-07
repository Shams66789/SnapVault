import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import DefaultImage from '../assets/download.png';
import DefaultImage1 from '../assets/google-png.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingOverlay from './LoadingOverlay'; // Adjust the path as per your file structure

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
const DEFAULT_IMAGE1 = Image.resolveAssetSource(DefaultImage1).uri;

const UserSetUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeForm, setActiveForm] = useState('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '167512415573-nl06dssniuto786f2cvdh1cviu9218ag.apps.googleusercontent.com',
    });
  }, []);

  const handleLogin = () => {
    setLoading(true);
    if (email === '' || password === '') {
      Alert.alert('Error', 'Email and password are required.');
      setLoading(false);
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // console.log('User signed in!');
        navigation.navigate('Home');
        setEmail(''); // Clear email input
        setPassword(''); // Clear password input
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'No user found with this email.');
        } else {
          Alert.alert('Error', error.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSignUp = () => {
    setLoading(true);
    if (email === '' || password === '' || confirmPassword === '') {
      Alert.alert('Error', 'All fields are required.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // console.log('User account created & signed in!');
        navigation.navigate('UserProfileImg', {user: userCredential.user});
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'This email address is already in use!');
        } else {
          Alert.alert('Error', error.message);
        }
      })
      .finally(() => setLoading(false));
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

  const handlePasswordReset = () => {
    setLoading(true);
    if (email === '') {
      Alert.alert('Error', 'Please enter your email to reset password.');
      setLoading(false);
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Success', 'Password reset email sent!');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo;

      if (!idToken) {
        Alert.alert('Error', 'Failed to get idToken from Google Sign-In');
        setLoading(false);
        return;
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      auth()
        .signInWithCredential(googleCredential)
        .then(async userCredential => {
          const isNewUser = userCredential.additionalUserInfo?.isNewUser;

          if (isNewUser) {
            navigation.navigate('UserProfileImg', {user: userCredential.user});
          } else {
            navigation.navigate('Home');
          }
        })
        .catch(error => {
          Alert.alert('Error', error.message);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Error', 'User cancelled the login process');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Error', 'Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services not available or outdated');
      } else {
        Alert.alert('Error', error.message);
      }
      setLoading(false);
    }
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

            <Text style={styles.forgetText} onPress={handlePasswordReset}>
              Forget Password?
            </Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.oRText}>-OR-</Text>

            <TouchableOpacity onPress={handleGoogleSignIn}>
              <Image
                source={{uri: DEFAULT_IMAGE1}}
                style={styles.googleButton}
              />
            </TouchableOpacity>
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

            <TouchableOpacity onPress={handleGoogleSignIn}>
              <Image
                source={{uri: DEFAULT_IMAGE1}}
                style={styles.googleButton}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <LoadingOverlay visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
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
    width: '95%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f45b69',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    flex: 1,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#d43d4e',
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
    borderColor: '#000',
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
  forgetText: {
    textAlign: 'right',
    color: '#000',
    fontFamily: 'inter_medium',
    marginBottom: 15,
  },
  oRText: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'inter_semi_bold',
    marginVertical: 10,
  },
  googleButton: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default UserSetUp;
