import { LinearGradient } from 'expo-linear-gradient';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export default function FooterDashboard() {
  return (
    <LinearGradient
        colors={['rgba(22, 53, 118, 0.24)', 'rgba(9, 16, 26, 0.24)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ padding:6, backdropFilter:'blur(5px)' }}
      >
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap:30,
      }} >

        <Pressable
            style={({ pressed }) => [
              styles.linkStyle,
              pressed && styles.pressed
            ]}
            onPress={() =>
              Linking.openURL('#')
            }
          >
            <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 12, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Discord</Text>
              
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.linkStyle,
              pressed && styles.pressed
            ]}
            onPress={() =>
              Linking.openURL('https://www.instagram.com/redplanetresorts/')
            }
          >
            
              <Image
                source={require('./../assets/images/instagram.png')}
                style={{ width: 46, height: 46, alignSelf: 'center' }}
              />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.linkStyle,
              pressed && styles.pressed
            ]}
            onPress={() =>
              Linking.openURL('https://redplanetresorts.com/collections')
            }
          >
            <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 12, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Store</Text>
              
          </Pressable>



      </View>
    </LinearGradient>
    
  );
}
const styles = StyleSheet.create({
  linkStyle:{},
  pressed:{ color:'#00DDF1'},
});