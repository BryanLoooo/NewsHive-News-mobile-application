import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

function FeaturedEateriesScreen() {
  const navigate = useNavigation();

  const eateryList = [
    {
      rows: [
        {
          name: "Bryan's BBQ",
          description: "Grill, Meats, $$$",
          deliveryTime: "20-40",
          thumbnail: require('./assets/barbequepic.png')
        },
        {
          name: "Noodles",
          description: "Asian, Noodles, $",
          deliveryTime: "15-25",
          thumbnail: require('./assets/noodlespic.png')
        }
      ]
    }
  ];

  const EateryCard = (props) => (
    <Cell
      backgroundColor="transparent"
      onPress={() =>
        navigate.navigate("Details", {
          restaurantName: props.title
        })
      }
      cellContentView={
        <View style={props.cardContainer}>
          <Image style={props.imageStyle} source={props.imageSource} />
          <View style={styles.deliveryTimeContainer}>
            <Text style={styles.deliveryText}>{props.deliveryDuration}</Text>
            <Text style={styles.minsText}>mins</Text>
          </View>
          <Text style={props.titleStyle}>{props.title}</Text>
          <Text style={props.subtitleStyle}>{props.subtitle}</Text>
        </View>
      }
    />
  );

  return (
    <View style={styles.pageWrapper}>
      <Text style={styles.title}>Jack's Picks</Text>
      <ScrollView>
        <TableView>
          {eateryList.map((block, i) => (
            <Section key={i} hideSeparator={false}>
              {block.rows.map((item, j) => (
                <EateryCard
                  key={j}
                  title={item.name}
                  subtitle={item.description}
                  deliveryDuration={item.deliveryTime}
                  imageSource={item.thumbnail}
                  titleStyle={{
                    marginTop: 5,
                    fontSize: 20,
                    fontWeight: 'bold'
                  }}
                  subtitleStyle={{
                    marginTop: 5,
                    fontSize: 14
                  }}
                  cardContainer={{
                    width: '100%',
                    height: 250,
                    backgroundColor: 'transparent',
                    marginLeft: 2
                  }}
                  imageStyle={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    marginBottom: 10
                  }}
                />
              ))}
            </Section>
          ))}
        </TableView>
      </ScrollView>
    </View>
  );
}

function RestaurantDetailScreen() {
  const params = useRoute();
  const restaurantTitle = params?.params?.restaurantName || 'Unknown';

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailText}>{restaurantTitle}</Text>
    </View>
  );
}

const NavigatorStack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }, []);
      
  return (
    <NavigationContainer>
      <NavigatorStack.Navigator>
        <NavigatorStack.Screen
          name="Home"
          component={FeaturedEateriesScreen}
          options={{ title: 'Restaurants', headerTitleAlign: 'center' }}
        />
        <NavigatorStack.Screen
          name="Details"
          component={RestaurantDetailScreen}
          options={{ title: 'Menu', headerTitleAlign: 'center' }}
        />
      </NavigatorStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    padding: 8
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  detailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  deliveryTimeContainer: {
    width: 100,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 50,
    right: 0,
    position: 'absolute',
    marginTop: 170,
    marginRight: 20,
    justifyContent: 'center'
  },
  deliveryText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  minsText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -5
  }
});
