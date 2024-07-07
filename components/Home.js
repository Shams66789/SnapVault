import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  BackHandler,
} from 'react-native';
import DefaultImage from '../assets/student.png';
import {FloatingAction} from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import LoadingOverlay from './LoadingOverlay';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import CustomCarousel from './CustomCarousel';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
const {width} = Dimensions.get('window');

const actions = [
  {
    icon: <Icon name="home" size={22} color="#000" />,
    name: 'bt_home',
    position: 2,
    color: '#ffeb3b',
  },
  {
    icon: <Icon name="cog" size={22} color="#000" />,
    name: 'bt_settings',
    position: 1,
    color: '#ff5722',
  },
];

const Home = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState('bars');
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchUserDetails = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();
      const userData = userDoc.data();
      setUserDetails({
        name: currentUser.displayName || '',
        profileImage: currentUser.photoURL || DEFAULT_IMAGE,
      });
    }
  };

  const fetchImages = async () => {
    try {
      const currentUser = auth().currentUser;
      const imagesSnapshot = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('images')
        .get();
      const imagesList = imagesSnapshot.docs.map(doc => doc.data().url);
      setImages(imagesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('images')
      .onSnapshot(snapshot => {
        const imagesList = snapshot.docs.map(doc => doc.data().url);
        setImages(imagesList);
      });

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp();
        return true;
      },
    );

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchImages();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserDetails();
      fetchImages();
    });

    return unsubscribe;
  }, [navigation]);

  const handleOpen = () => {
    setIcon('times');
  };

  const handleClose = () => {
    setIcon('bars');
  };

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
      });

      const currentUser = auth().currentUser;
      const storageRef = storage().ref(
        `users/${currentUser.uid}/images/${Date.now()}`,
      );
      await storageRef.putFile(image.path);
      const imageUrl = await storageRef.getDownloadURL();

      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('images')
        .add({url: imageUrl});

      fetchImages(); // Refresh images after upload
    } catch (error) {
      Alert.alert('Error', 'Failed to pick or upload image.');
    }
  };


  const refreshScreen = () => {
    setLoading(true); // Simulate refresh by setting loading state
    fetchImages(); // Re-fetch images
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{uri: userDetails.profileImage}}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userDetails.name}</Text>
      </View>
      <View style={styles.content}>
        {loading ? (
          <LoadingOverlay visible={loading} />
        ) : images.length === 0 ? (
          <Text style={styles.uploadText}>Upload your story</Text>
        ) : (
          <CustomCarousel images={images} />
        )}
      </View>
      <TouchableOpacity style={styles.footerButton} onPress={pickImage}>
        <View style={styles.addButton}>
          <Icon name="plus" size={30} color="#fff" />
        </View>
      </TouchableOpacity>

      <FloatingAction
        actions={actions}
        onPressItem={name => {
          if (name === 'bt_settings') {
            navigation.navigate('Settings');
          } else if (name === 'bt_home') {
            refreshScreen();
          }
        }}
        onOpen={handleOpen}
        onClose={handleClose}
        color="#fff"
        floatingIcon={<Icon name={icon} size={20} color="#000" />}
      />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 20,
    color: '#fff',
  },
  footerButton: {
    alignItems: 'left',
    marginLeft: 20,
    marginBottom: 26,
  },
  addButton: {
    backgroundColor: '#ff5722',
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Home;
