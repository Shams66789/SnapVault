import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Home = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          // Fetch user details from Firestore
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();
          const userData = userDoc.data();

          setUserDetails({
            name: currentUser.displayName,
            dob: userData.dob,
          });

          // Set profile image directly from Firebase Authentication
          setProfileImage(currentUser.photoURL);
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#f45b69" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {userDetails ? (
        <>
          {profileImage && (
            <Image
              source={{uri: profileImage}}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                marginBottom: 20,
              }}
            />
          )}
          <Text style={{fontSize: 20, color: '#000', marginBottom: 10}}>
            Name: {userDetails.name}
          </Text>
          <Text style={{fontSize: 20, color: '#000', marginBottom: 10}}>
            Date of Birth: {userDetails.dob}
          </Text>
        </>
      ) : (
        <Text style={{fontSize: 20, color: '#000'}}>
          No user details found.
        </Text>
      )}
    </View>
  );
};

export default Home;
