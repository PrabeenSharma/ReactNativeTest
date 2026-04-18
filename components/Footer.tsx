import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

export default function Footer() {
  return (
    <LinearGradient
        colors={['rgba(22, 53, 118, 0.14)', 'rgba(9, 16, 26, 0.14)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ padding:20 }}
      >
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap:10,
      }} >
        <Text style={{ fontSize: 13,
            fontWeight: '400',
            textAlign: 'center',
            color: '#fff', 
            fontFamily: 'Audiowide_400Regular',
        }}>
          If user already has ticket
        </Text>
        <Image source={require('./../assets/images/arrow.png')} style={{ width: 13, height: 10, alignSelf: 'center' }} />
        <Text style={{ fontSize: 13,
            fontWeight: '400',
            textAlign: 'center',
            color: '#fff', 
            fontFamily: 'Audiowide_400Regular',
        }}>
          scan QR
        </Text>
        <Image source={require('./../assets/images/arrow.png')} style={{ width: 13, height: 10, alignSelf: 'center' }} />
        <Text style={{ fontSize: 13,
            fontWeight: '400',
            textAlign: 'center',
            color: '#fff', 
            fontFamily: 'Audiowide_400Regular',
        }}>
           proceed If not
        </Text>
        <Image source={require('./../assets/images/arrow.png')} style={{ width: 13, height: 10, alignSelf: 'center' }} />
        <Text style={{ fontSize: 13,
            fontWeight: '400',
            textAlign: 'center',
            color: '#fff', 
            fontFamily: 'Audiowide_400Regular',
        }}>
          go to website purchase page
        </Text>
      </View>
    </LinearGradient>
    
  );
}