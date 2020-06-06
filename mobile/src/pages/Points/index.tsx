import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import styles from './styles';
import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface RouteParams {
  uf: string;
  city: string;
}

function Points() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<number[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(function () {
    api.get('/items')
      .then(res => setItems(res.data))
  }, []);

  useEffect(function () {
    Location.requestPermissionsAsync()
      .then(function (data) {
        if (data.status !== 'granted') {
          Alert.alert('Ooops', 'Precisamos da sua permissão para obter a localização');
          return;
        }

        Location.getCurrentPositionAsync()
          .then(function (location) {
            const { latitude, longitude } = location.coords;
            setInitialPosition([latitude, longitude]);
          });
      });
  }, []);

  useEffect(function () {
    const params = route.params as RouteParams;

    api.get('/points', {
      params: {
        uf: params.uf,
        city: params.city,
        items: selectedItem
      }
    }).then(res => setPoints(res.data));
  }, [selectedItem]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { id });
  }

  function handleSelectedItem(id: number) {
    const arr = [...selectedItem];
    const index = arr.indexOf(id);

    if (index >= 0)
      arr.splice(index, 1);
    else
      arr.push(id);

    setSelectedItem(arr);
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {
            initialPosition[0] !== 0 &&
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.010,
                longitudeDelta: 0.010
              }}
            >
              {
                points.map(point => (
                  <Marker
                    key={point.id}
                    style={styles.mapMarker}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }}
                    onPress={_ => handleNavigateToDetail(point.id)}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                      <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                    </View>
                  </Marker>
                ))
              }
            </MapView>
          }
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {
            items.map(item => (
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedItem.includes(item.id) ? styles.selectedItem : null
                ]}
                onPress={_ => handleSelectedItem(item.id)}
                key={item.id}
              >
                <SvgUri width={42} height={42} uri={item.image_url} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </>
  );
}

export default Points;
