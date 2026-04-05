import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RetailAppProvider} from './src/context/AppContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {theme} from './src/theme/tokens';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <RetailAppProvider>
        <AppNavigator />
      </RetailAppProvider>
    </SafeAreaProvider>
  );
}

export default App;
