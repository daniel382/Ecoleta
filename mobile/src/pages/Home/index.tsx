import React, { useState, useEffect} from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Select from 'react-native-picker-select';

import styles from './styles';
import ibge from '../../services/ibge';

interface SelectItems {
  label: string;
  value: string;
  key: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

function Home() {
  const navigation = useNavigation();

  const [ufList, setUFList] = useState<SelectItems[]>([]);
  const [citiesList, setCitiesList] = useState<SelectItems[]>([]);
  
  const [selectedUF, setSelectedUF] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');

  useEffect(function () {
    ibge.get<IBGEUFResponse[]>('/estados')
      .then(function (res) {
        const ufMappedList = res.data.map(uf => ({
          label: uf.sigla,
          value: uf.sigla,
          key: uf.sigla
        }));

        setUFList(ufMappedList);
      })
  }, []);

  useEffect(function () {
    if (selectedUF === '0')
      return;

    ibge.get<IBGECityResponse[]>(`/estados/${selectedUF}/municipios`)
      .then(function (res) {
        const cityMappedList = res.data.map(city => ({
          label: city.nome,
          value: city.nome,
          key: city.nome
        }));

        setCitiesList(cityMappedList);
      })
  }, [selectedUF]);

  function handleNavigateToPoints() {
    if (selectedUF === '0' || selectedCity === '0')
      return;
    
    navigation.navigate('Points', { uf: selectedUF, city: selectedCity });
  }

  function handleSelectedUF(uf: string) {
    setSelectedUF(uf);
  }
  
  function handleSelectedCity(city: string) {
    setSelectedCity(city);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />

        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.
        </Text>
      </View>

      <Select
        onValueChange={handleSelectedUF}
        value={selectedUF}
        placeholder={{ label: "Selecione o estado" }}
        items={ufList}
      />
      
      <Select
        onValueChange={handleSelectedCity}
        value={selectedCity}
        placeholder={{ label: "Seleciona a cidade" }}
        items={citiesList}
      />

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>

          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

export default Home;
