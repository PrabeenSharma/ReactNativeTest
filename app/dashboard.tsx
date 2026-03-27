import { formatDate } from '@/utils/date';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';



export default function DashboardScreen() {
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    fetch('https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=trip7hge34')
      .then((res) => res.json())
      .then((data) => {
        setPage(data[0]); // first item
      })
      .catch((err) => console.log(err));
  }, []);

  if (!page) {
    return <Text>Loading...</Text>;
  }

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {page.title.rendered}
      </Text>

       <Text>Mission Name: {page.acf?.mission_name} </Text> 
       <Text>Mission Status: {page.acf?.mission_status} </Text> 


       
      <Text>{page?.custom_info?.info_row_1}   :  {page?.mission_calculation?.time_seconds} sec </Text>
      <Text>{page?.custom_info?.info_row_2}   :  {page?.mission_calculation?.time_seconds * 2 } sec </Text>

      <Text>Ship Speed: {page.acf?.ship_speed}</Text>

      <Text>Launch Date: {formatDate(page?.acf?.launch_date || '')}</Text>

      <Text> { page?.theme_options?.example_uploader } </Text>  

     
       
       {/* <RenderHtml source={{ html: page.acf?.captains_message || '' }}
      /> */}

      <Button
                title="back To Home"
                onPress={() => router.push('/')}
              />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  row:{},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
  },
  heading:{},
});