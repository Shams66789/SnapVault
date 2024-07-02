import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';


const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  
  return (
    <View>
      {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Welcome to Your App!</Text>
      </View> */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}


// const HomeScreen =()=>{
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome to Home Screen!</Text>
//     </View>
//   );
// }

function HomeScreen(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Home Screen!</Text>
    </View>
  );
}

export default App;
