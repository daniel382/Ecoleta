import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import { RectButton } from 'react-native-gesture-handler';
import { AppLoading } from 'expo';

import styles from './styles';
import api from '../../services/api';

interface Params {
  id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

function Detail() {
  const navigation = useNavigation();
  const route = useRoute();

  const [data, setData] = useState<Data>({} as Data);

  const routeParams = route.params as Params;

  useEffect(function () {
    api.get(`/points/${routeParams.id}`)
      .then(res => setData(res.data));
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Itens para coleta',
      recipients: [data.point.email]
    });
  }

  function handleWhatsapp() {
    const message = "Olá, encontrei vocês aqui no app do Ecoleta e estou " +
    "entrando em contanto pois possuo alguns ítens para vocês.\n " +
    "Vamos combinar um horário para a retirada?";

    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=${message}`);
  }

  if (!data.point)
    return <AppLoading />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data.point.image_url }} />

        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

export default Detail;
