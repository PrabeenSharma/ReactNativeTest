import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#FFFFFF',
  text: '#333333',
  border: '#E0E0E0',
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});