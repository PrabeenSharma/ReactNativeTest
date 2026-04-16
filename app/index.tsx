import { Link, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GlobalStyles } from '../styles/globalStyles';

export default function HomeScreen() {

   const router = useRouter();

  return (
    <ScrollView style={GlobalStyles.container}>

    <View style={{ flex: 1 , alignItems: 'center', padding: 30, justifyContent: 'center', gap: 0, }}>
    <Text style={{ paddingBottom: 30, fontSize: 24, fontWeight: '800', textAlign:'center'  }}>Welcome to Red Planel Resort </Text>

    <View style={{ flex:1, flexDirection:'row', gap:20, }}>
      <Link style={styles.linkStyle} href="/scanner">scanner</Link>
      <TouchableOpacity style={styles.linkStyle} onPress={() => Linking.openURL('https://dev4work.com/thefirstonmars/')}>
        <Text>Buy Ticket</Text>
      </TouchableOpacity>
    </View>

    <Link style={styles.linkStyleRed} href="/dashboard">Dashboard</Link>


    </View>

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  linkStyle:{
    backgroundColor: '#00ddf1', paddingLeft:15, paddingRight:15, paddingTop:12, paddingBottom:12, 
  },
  linkStyleRed:{
    backgroundColor: 'red', paddingLeft:15, paddingRight:15, paddingTop:12, paddingBottom:12, marginTop:20, color:'#fff'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
