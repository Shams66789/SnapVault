import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  BackHandler,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useFocusEffect} from '@react-navigation/native';
import LoadingOverlay from './LoadingOverlay'; // Assuming LoadingOverlay is defined correctly
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import DefaultImage from '../assets/student.png';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;

const UserProfileImg = ({navigation, route}) => {
  const [imageUri, setImageUri] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(false);
  const {user} = route.params || {};

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const handleSelectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        setImageUri(image.path);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error.message);
        }
      });
  };

  const handleNext = async () => {
    if (!user) {
      Alert.alert('Error', 'User information is missing.');
      return;
    }

    setLoading(true);
    const uploadUri = imageUri === DEFAULT_IMAGE ? null : imageUri;
    const imageRef = storage().ref(`profilePictures/${user.uid}.jpg`);

    try {
      if (uploadUri) {
        await imageRef.putFile(uploadUri);
      } else {
        await imageRef.putString(DEFAULT_IMAGE, 'data_url');
      }

      const imageUrl = await imageRef.getDownloadURL();
      await auth().currentUser.updateProfile({photoURL: imageUrl});

      console.log('Profile image uploaded and URL set!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error uploading profile image: ', error);
      Alert.alert('Error', 'Failed to upload profile image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingOverlay />}
      <View style={styles.containerImg}>
        <Image source={{uri: imageUri}} style={styles.image} />
      </View>
      <TouchableOpacity style={styles.AddImgButton} onPress={handleSelectImage}>
        <Text style={styles.AddImgButtonText}>Add profile photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.NextButtonText}>Next</Text>
      </TouchableOpacity>
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
  containerImg: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  AddImgButton: {
    backgroundColor: '#f45b69',
    width: 250,
    marginTop: 50,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  AddImgButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
  nextButton: {
    backgroundColor: '#f45b69',
    width: 120,
    marginTop: 40,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  NextButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
});

export default UserProfileImg;
