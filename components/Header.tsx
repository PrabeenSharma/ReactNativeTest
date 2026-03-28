// components/Header.js
import { useEffect, useState } from 'react';
import { Image, Linking, TouchableOpacity, View } from 'react-native';

export default function Header() {

  const [page, setPage] = useState<any>(null);
  
    useEffect(() => {
      fetch('https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=trip7hge34')
        .then((res) => res.json())
        .then((data) => {
          setPage(data[0]); // first item
        })
        .catch((err) => console.log(err));
    }, []);


  return (
    <View style={{ paddingLeft:15, paddingRight:15, paddingTop:50, paddingBottom:15,   backgroundColor: '#000', alignItems: 'center'  }}>
      <TouchableOpacity onPress={() => Linking.openURL('https://dev4work.com/thefirstonmars/')}>
       <Image 
        source={{ uri: page?.theme_options?.example_uploader }} 
        style={{ width: 238, height: 49 }} 
      />
      </TouchableOpacity>
    </View>
  );
}