import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from 'react';
import DefaultImage from '../assets/student.png';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;

const UserProfileImg = () => {

  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setProfileImage(response.uri);
      }
    });
  };

  const handleNext = async () => {
    try {
      const imageUri = profileImage === DEFAULT_IMAGE ? null : profileImage;
      // Upload image to Firebase Storage if not default
      if (imageUri) {
        const uploadUri = imageUri;
        const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const storageRef = storage().ref(`profile/${filename}`);
        await storageRef.putFile(uploadUri);
        const imageUrl = await storageRef.getDownloadURL();
        console.log('Uploaded image URL:', imageUrl);
        // Navigate to next screen or handle next action
      } else {
        // Handle case where default image is used
        console.log('Using default image');
        // Navigate to next screen or handle next action
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };


    return (
      <View style={styles.container}>
        <View style={styles.containerImg}>
          <Image source={{uri: DEFAULT_IMAGE}} style={styles.image} />
        </View>

        <TouchableOpacity
          style={styles.AddImgButton}
          onPress={handleChoosePhoto}>
          <Text style={styles.AddImgButtonText}>Add profile photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.AddImgButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
}

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
    // backgroundColor: '#fff',
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
});

export default UserProfileImg;