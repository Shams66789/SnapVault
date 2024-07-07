import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React, { Component, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import UserSetUp from './components/UserSetUp';
import Home from './components/Home';
import UserProfileImg from './components/UserProfileImg';
import UserInfo from './components/UserInfo';
import settings from './components/settings';


const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {

  

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  
  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //     <Text>Welcome to Your App!</Text>
    //   </View>

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="User Setup"
          component={UserSetUp}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserProfileImg"
          component={UserProfileImg}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserInfo"
          component={UserInfo}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          component={settings}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
