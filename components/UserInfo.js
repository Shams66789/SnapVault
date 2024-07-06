import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LoadingOverlay from './LoadingOverlay'; // Import LoadingOverlay component
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook from React Navigation

const UserInfo = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading overlay

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackButtonPress = () => {
    if (navigation.isFocused()) {
      // Check if the current screen is focused
      BackHandler.exitApp(); // Exit the app if focused and back button is pressed
      return true;
    }
    return false;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSave = async () => {
    if (!name || !dob) {
      Alert.alert('Error', 'Name and Date of Birth are required.');
      return;
    }

    setLoading(true); // Show loading overlay

    try {
      // Save name to Firebase Auth profile
      await auth().currentUser.updateProfile({
        displayName: name,
      });

      // Save Date of Birth to Firestore (replace 'users' with your collection name)
      await firestore().collection('users').doc(auth().currentUser.uid).set({
        name,
        dob: dob.toDateString(), // Store dob as a string or as needed
      });

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving user details: ', error);
      Alert.alert('Error', 'Failed to save user details.');
    } finally {
      setLoading(false); // Hide loading overlay
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <Text style={styles.label}>Enter your Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your name..."
        placeholderTextColor={'#000'}
        value={name}
        onChangeText={text => setName(text)}
      />
      <View style={styles.rowDatePicker}>
        <Text style={[styles.label, {marginRight: 20, marginTop: 12}]}>
          Select your DOB 👉:
        </Text>

        <Icon name="calendar" size={22} color="#fff" onPress={showDatepicker} />
      </View>
      {dob && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Date of Birth:</Text>
          <Text style={styles.date}>{dob.toDateString()}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dob || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'inter_semi_bold',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 30,
    borderRadius: 5,
    fontSize: 16,
    color: '#000',
    fontFamily: 'inter_regular',
  },
  datePickerButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    marginBottom: 20,
  },
  dateContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'inter_semi_bold',
  },
  date: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    fontFamily: 'inter_regular',
  },
  rowDatePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#f45b69',
    width: 120,
    marginTop: 100,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'inter_semi_bold',
  },
});

export default UserInfo;
