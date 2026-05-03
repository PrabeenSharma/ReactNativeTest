import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type InstagramPost = {
  id: string;
  caption?: string;
  media_url: string;
  media_type: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
};

const ACCESS_TOKEN =
  'IGAAHKoYxeZA3JBZAFlzamZA2RHZAFdmVYR1ZAsLTFTWlJWa0hQamJBeFB2R0VQTW4xeUJnTS0xVklZAUjVnalNkRUtXNjlGQXptV25qS2xhcGhDeFd3SE16UEhNRmd1cW4tSXRCX2dxYTRqb1EtN1VaQ0Q3cDBB';

export default function InstagramFeed() {
  const [posts, setPosts] = useState<
    InstagramPost[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  async function fetchInstagramPosts() {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}`
      );

      const data = await response.json();

      const latestPosts = data.data
        .sort(
          (
            a: InstagramPost,
            b: InstagramPost
          ) =>
            new Date(
              b.timestamp
            ).getTime() -
            new Date(
              a.timestamp
            ).getTime()
        )
        .slice(0, 6);

      setPosts(latestPosts);
    } catch (error) {
      console.log(
        'Instagram fetch error:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <FlatList scrollEnabled={false}
      data={posts}
      numColumns={2}
      keyExtractor={item => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={
        styles.contentContainer
      }

      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>
            Instagram Feeds
          </Text>
        </View>
      }

      ListFooterComponent={
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.instagram.com/redplanetresorts/'
              )
            }
          >
            <LinearGradient
              colors={['#0C2046', '#004F99']}
              locations={[0.1624, 0.816]}
              start={{ x: 0.85, y: 0.15 }}
              end={{ x: 0.15, y: 0.85 }}
              style={styles.optionGradient}
            >
              <Text style={styles.optionText}>
                Follow us for more
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      }

      renderItem={({ item }) => {
        const image =
          item.media_type === 'VIDEO'
            ? item.thumbnail_url
            : item.media_url;

        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              Linking.openURL(
                item.permalink
              )
            }
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
            />

            {/* <Text
              numberOfLines={2}
              style={styles.caption}
            >
              {item.caption ||
                'Instagram Post'}
            </Text> */}
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 17,
    paddingBottom: 30,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    marginBottom: 25,
  },

  heading: {
     fontSize: 16,  lineHeight: 31, color: '#fff',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', textAlign:'center',
  },

  subHeading: {
    color: '#8FB6D9',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },

  row: {
    justifyContent:
      'space-between',
    marginBottom: 16,
  },

  card: {
    width: '48%',
  },

  image: {
    width: '100%',
    aspectRatio:1,
    borderRadius: 18,
    backgroundColor: '#111',
  },

  caption: {
    color: '#fff',
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
  },

  footer: {
    marginTop: 25,
    alignItems: 'center',
  },

  bottomButton: {
    backgroundColor: '#004F99',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 50,
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily:'Audiowide_400Regular',
    textTransform: 'uppercase',
  },
    optionGradient: {
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:15,
  },
   optionText: {
    fontFamily: 'Audiowide_400Regular',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#fff',
  },

});