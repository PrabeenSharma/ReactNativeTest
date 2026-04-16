import { Link, useRouter } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {

   const router = useRouter();

  return (
    
    <ScrollView
  style={{ flex: 1, backgroundColor: 'transparent' }}
  contentContainerStyle={{
    flexGrow: 1,
    backgroundColor: 'transparent', // 👈 ADD THIS
  }}
  showsVerticalScrollIndicator={false}
>
      <View
        style={{
          alignItems: 'center',
          padding: 30,
          justifyContent: 'center',
          backgroundColor: 'transparent',
          flex: 1 // 👈 FIX
        }}
      >
        <Text
          style={{
            paddingBottom: 30,
            fontSize: 35,
            fontWeight: '400',
            textAlign: 'center',
            color: '#fff', 
            fontFamily: 'Audiowide_400Regular'
          }}
        >
          Welcome to Red Planet Resort
        </Text>

        <View style={{ flexDirection: 'column', gap: 20, padding:15 }}>
          
          <Pressable
              style={({ pressed }) => [
                styles.linkStyle,
                pressed && styles.pressed
              ]}
              onPress={() => router.push('/scanner')}
            >
              <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 14, fontWeight: '400', textTransform: 'uppercase', marginBottom:14, textAlign: 'center' }}>Scan your ticket</Text>

              <Image
                source={require('./../assets/images/scannerImage.png')}
                style={{ width: 140, height: 137, alignSelf: 'center' }}
              />
            </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.linkStyle,
              pressed && styles.pressed
            ]}
            onPress={() =>
              Linking.openURL('https://dev4work.com/thefirstonmars/')
            }
          >
            <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 14, fontWeight: '400', textTransform: 'uppercase', marginBottom:14, textAlign: 'center' }}>Buy Ticket</Text>
            <Image
                source={require('./../assets/images/ticket.png')}
                style={{ width: 161, height: 105, alignSelf: 'center' }}
              />
          </Pressable>
        </View>

        <Link style={styles.linkStyleRed} href="/dashboard">
          Dashboard
        </Link>
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  linkStyle:{
    backgroundColor: 'rgba(217, 217, 217, 0.12)', paddingLeft:22, paddingRight:22, paddingTop:22, paddingBottom:22, borderRadius: 6, color:'#fff', textAlign: 'center', fontFamily: 'Audiowide_400Regular', fontSize:14, fontWeight: '400', textTransform: 'uppercase',
  },

  pressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    transform: [{ scale: 0.98 }],
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
