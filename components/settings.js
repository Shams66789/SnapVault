import React, {useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import DefaultImage from '../assets/student.png';
import ImagePicker from 'react-native-image-crop-picker'; // Import ImagePicker
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingOverlay from './LoadingOverlay';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;

const Settings = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setName(currentUser.displayName || '');
      setProfileImage(currentUser.photoURL || DEFAULT_IMAGE);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true; // Returning true prevents default behavior (exiting the app)
      };

      // Add listener for hardware back press
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  const saveChanges = () => {
    setLoading(true); // Start loading

    const currentUser = auth().currentUser;
    if (currentUser) {
      currentUser
        .updateProfile({
          displayName: name.trim(),
          photoURL: profileImage,
        })
        .then(() => {
          Alert.alert('Success', 'Update successful');
        })
        .catch(error => {
          Alert.alert('Error updating profile: ', error.message);
        })
        .finally(() => {
          setLoading(false); // Stop loading after operation completes
        });
    }
  };

  const logout = () => {
    setLoading(true); // Start loading

    auth()
      .signOut()
      .then(() => {
        Alert.alert('Sign out', 'User signed out!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('UserSetUp'),
          },
        ]);
      })
      .catch(error => {
        Alert.alert('Sign out error: ', error.message);
      })
      .finally(() => {
        setLoading(false); // Stop loading after operation completes
      });
  };

  const handleEditImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
      });

      // Update profile image state
      setProfileImage(image.path);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingOverlay />}
      <View style={styles.header}>
        <Image source={{uri: profileImage}} style={styles.profileImage} />
        <Text style={styles.userName}>{name}</Text>
      </View>
      <ScrollView>
        <View style={styles.centerContainer}>
          <View style={styles.containerImg}>
            <Image source={{uri: profileImage}} style={styles.image} />
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditImage}>
            <Icon name="edit" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.label}>Enter your Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your name..."
            placeholderTextColor={'#000'}
            value={name}
            onChangeText={text => setName(text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logOutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 4,
  },
  userName: {
    marginLeft: 15,
    fontSize: 18,
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  containerImg: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    marginBottom: 50,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'inter_semi_bold',
  },
  input: {
    width: '80%',
    backgroundColor: '#EEE9E9',
    padding: 10,
    marginBottom: 30,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    fontFamily: 'inter_regular',
  },
  saveButton: {
    backgroundColor: '#f45b69',
    width: '65%',
    marginTop: 60,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
  logOutButton: {
    backgroundColor: '#f45b69',
    width: '65%',
    marginTop: 40,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
  editButton: {
    position: 'absolute',
    top: 160,
    right: 100,
    backgroundColor: '#f45b69',
    padding: 10,
    borderRadius: 20,
  },
});

export default Settings;
