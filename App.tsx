/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from 'react';
import {Alert, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createTables} from './src/db/sqlite/database';


function App() {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createTables();
        console.log('Tables created successfully');

      } catch (error) {
        console.error('Error creating tables:', error);
        Alert.alert('Database Error', 'Failed to initialize the database. Please try again.');
      }
    };

    initializeDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>RetailApp</Text>
        <Text style={styles.subtitle}>Database initialization in progress</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf4',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default App;