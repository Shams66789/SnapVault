import { StyleSheet, Text, View } from "react-native";
import React from 'react';

const UserProfileImg = () => {
    return (
        <View style = {styles.container}>
            <Text style = {{color : '#fff'}}>Welcome to Profile Photo Screen</Text>
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
});

export default UserProfileImg;