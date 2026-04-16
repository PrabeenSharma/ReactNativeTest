import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#FFFFFF',
  text: '#333333',
  border: '#E0E0E0',
};

export const GlobalStyles = StyleSheet.create({

  mainbody:{
    backgroundImage: 'url(../assets/images/mainBg.png)', backgroundSize: 'cover', flex:1, backgroundPosition: 'bottom', backgroundRepeat: 'no-repeat'
  },  
  header:{
    paddingTop:15, paddingBottom:15,  alignItems: 'center'
  }, 

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

  mainheading:{
    fontSize:35,
    lineHeight: 42,
    color: '#000',
    textAlign:'center'
  },


});