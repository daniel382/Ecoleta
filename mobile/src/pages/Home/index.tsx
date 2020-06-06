import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Select from 'react-native-picker-select';

import styles from './styles';
import ibge from '../../services/ibge';
import Toast from '../../components/Toast';

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

  const [showToast, setShowToast] = useState(false);

  useEffect(function () {
    ibge.get<IBGEUFResponse[]>('/estados')
      .then(res => res.data.map(uf => ({
        label: uf.sigla,
        value: uf.sigla,
        key: uf.sigla
      })))
      .then(ufs => ufs.sort((a, b) => a.key > b.key ? 1 : -1))
      .then(ufs => setUFList(ufs))
  }, []);

  useEffect(function () {
    if (selectedUF === '0')
      return;

    ibge.get<IBGECityResponse[]>(`/estados/${selectedUF}/municipios`)
      .then(res => res.data.map(city => ({
        label: city.nome,
        value: city.nome,
        key: city.nome
      })))
      .then(cities => cities.sort((a, b) => a.key > b.key ? 1 : -1))
      .then(cities => setCitiesList(cities))
  }, [selectedUF]);

  function handleNavigateToPoints() {
    if (selectedUF === '0') {
      setShowToast(true);
      return;
    }

    if (selectedCity === '0') {
      setShowToast(true);
      return;
    }

    navigation.navigate('Points', { uf: selectedUF, city: selectedCity });
  }

  function handleSelectedUF(uf: string) {
    if (!uf)
      uf = '0';

    setSelectedUF(uf);
  }

  function handleSelectedCity(city: string) {
    if (!city)
      city = '0';

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

      <View style={styles.select}>
        <Select
          onValueChange={handleSelectedUF}
          value={selectedUF}
          placeholder={{ label: "Selecione o estado" }}
          items={ufList}
          Icon={() => <Icon name="chevron-down" size={24} color="#ccc" />}
          style={{ iconContainer: { top: 12 }}}
        />
      </View>

      <View style={styles.select}>
        <Select
          onValueChange={handleSelectedCity}
          value={selectedCity}
          placeholder={{ label: "Seleciona a cidade" }}
          items={citiesList}
          Icon={() => <Icon name="chevron-down" size={24} color="#ccc" />}
          style={{ iconContainer: { top: 12 }}}
        />
      </View>

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

      <Toast
        show={showToast}
        message="Selecione estado e cidade..."
        onAnimationEnd={() => setShowToast(false)}
      />
    </ImageBackground>
  );
}

export default Home;
