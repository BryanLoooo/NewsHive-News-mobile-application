// import libraries and dependencies
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { useFavourites } from './FavouriteContext';

// import images and media
import starIcon from '../assets/star.png';
import starFilledIcon from '../assets/star-filled.png';

// declare variables
const SCREEN_W = Dimensions.get('window').width;
const H_PADDING = 12;
const GAP = 12;
const HALF_W = (SCREEN_W - H_PADDING * 2 - GAP) / 2;

// Article function
export default function Article({ article, variant = 'large', onOpen = () => {} }) {
  const { favourites, toggleFavourite } = useFavourites();
  const isFavourite = !!favourites[article.url];
  const isLarge = variant === 'large';

  return (
    <View style={[styles.card, { width: isLarge ? '100%' : HALF_W }]}>
      {article.urlToImage && (
        <Pressable onPress={() => onOpen(article)}>
          <Image
            source={{ uri: article.urlToImage }}
            style={[styles.image, isLarge ? { height: 200 } : { height: 120 }]}
          />
        </Pressable>
      )}
      <Pressable style={styles.content} onPress={() => onOpen(article)}>
        <Text style={[styles.title, isLarge ? { fontSize: 18 } : { fontSize: 14 }]} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={isLarge ? 3 : 2}>
          {article.description}
        </Text>
      </Pressable>
      <TouchableOpacity style={styles.starContainer} onPress={() => toggleFavourite(article)}>
        <Image source={isFavourite ? starFilledIcon : starIcon} style={styles.star} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    marginBottom: GAP, 
    borderRadius: 8, 
    backgroundColor: '#fff', 
    overflow: 'hidden', 
    elevation: 3 
  },
  image: { 
    width: '100%', 
    borderTopLeftRadius: 8, 
    borderTopRightRadius: 8 
  },
  content: { 
    padding: 10, 
    flex: 1 
  },
  title: { 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  description: { 
    fontSize: 13, 
    color: '#444' 
  },
  starContainer: { 
    position: 'absolute', 
    right: 10, 
    bottom: 10 
  },
  star: { 
    width: 24, 
    height: 24 
  },
});
