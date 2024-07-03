import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React, { Component, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import UserSetUp from './components/UserSetUp';


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
          options = {{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
