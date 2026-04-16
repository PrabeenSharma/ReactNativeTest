// components/Header.js
import { Image, Linking, TouchableOpacity, View } from 'react-native';

import { GlobalStyles } from '../styles/globalStyles';

export default function Header() {



  return (
    <View style={GlobalStyles.header}>
      <TouchableOpacity onPress={() => Linking.openURL('https://dev4work.com/thefirstonmars/')}>
       <Image 
        source={require('./../assets/images/logo.png')} 
        style={{ width: 252, height: 51 }} 
      />
      </TouchableOpacity>
    </View>
  );
}