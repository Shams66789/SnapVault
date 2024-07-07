import React from 'react';
import {Modal, ActivityIndicator, StyleSheet, View} from 'react-native';

const LoadingOverlay = ({visible}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent>
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F2D7D5" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    // backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingOverlay;
