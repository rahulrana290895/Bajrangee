import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AppClosedScreen = () => {
  return (
    <View style={styles.container}>

      {/* IMAGE */}
      <Image
        source={require('./assets/temporary_close.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* TITLE */}
      <Text style={styles.title}>App is Temporary Close</Text>

      {/* SUBTITLE */}
      <Text style={styles.subtitle}>
        Please try again later.
      </Text>

    </View>
  );
};

export default AppClosedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    height: 250,
    marginBottom: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
});
