import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import api from '../../services/api';
import ibge from '../../services/ibge';
import logo from '../../assets/logo.svg';
import Alert from '../../components/Alert';
import Dropzone from '../../components/Dropzone';
import './styles.css';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

function CreatePoint() {
  // data from external APIs
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [ufList, setUFList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);

  // data for/from form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [items, setItems] = useState<number[]>([]);

  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const [selectedFile, setSelectedFile] = useState<File>();

  // navigation
  const history = useHistory();

  // alerts
  const [alertHidden, setAlertHidden] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertError, setAlertError] = useState(false);

  useEffect(function () {
    api.get('/items')
      .then(res => setItemsList(res.data))
  }, []);

  useEffect(function () {
    ibge.get<IBGEUFResponse[]>('/estados')
      .then(res => res.data.map(uf => uf.sigla))
      .then(ufs => ufs.sort((a, b) => a > b ? 1 : -1))
      .then(ufs => setUFList(ufs))
  }, [])

  // exercutar sempre que 'selectedUF' mudar
  useEffect(function () {
    if (selectedUF === '0')
      return;

    ibge.get<IBGECityResponse[]>(`/estados/${selectedUF}/municipios`)
      .then(res => res.data.map(city => city.nome))
      .then(cities => cities.sort((a, b) => a > b ? 1 : -1))
      .then(cities => setCitiesList(cities))
  }, [selectedUF])

  useEffect(function () {
    navigator.geolocation.getCurrentPosition(function (position) {
      setInitialPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, [])

  function handleNameInput(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleEmailInput(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handleWhatsappInput(e: ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value;
    if (digit.match(/\D/g))
      return;

    setWhatsapp(e.target.value);
  }

  function handleSelectUF(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedUF(e.target.value);
  }

  function handleSelectCity(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(e.target.value);
  }

  function handleMapClick(e: LeafletMouseEvent) {
    setSelectedPosition([e.latlng.lat, e.latlng.lng]);
  }

  function handleSelectedItems(item: number) {
    const itemsClone = [...items];
    const index = itemsClone.indexOf(item);

    if (index === -1)
      itemsClone.push(item);
    else
      itemsClone.splice(index, 1);

    setItems(itemsClone);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const [latitude, longitude] = (selectedPosition[0] === 0)
      ? initialPosition
      : selectedPosition;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('items', items.join(','));
    data.append('uf', selectedUF);
    data.append('city', selectedCity);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));

    if (selectedFile)
      data.append('image', selectedFile);

    api.post('/points', data)
      .then(function () {
        setAlertMessage('Ponto de coleta cadastrado!');
        setAlertError(false);
        setAlertHidden(false);

        setTimeout(function () {
          setAlertHidden(true);
          history.push('/');
        }, 1200);
      })
      .catch(function (err) {
        setAlertMessage('Ops! Algo deu errado...');
        setAlertError(true);
        setAlertHidden(false);

        setTimeout(function () {
          setAlertHidden(true);
        }, 1500);

        console.log(err);
      });
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
        Voltar para home
      </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={handleNameInput} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleEmailInput}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={whatsapp}
                onChange={handleWhatsappInput}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={initialPosition}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUF}
                onChange={handleSelectUF}
              >
                <option value="0">Selecione uma UF</option>

                {
                  ufList.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))
                }
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>

                {
                  citiesList.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {
              itemsList.map(item => (
                <li
                  key={item.id}
                  onClick={e => handleSelectedItems(item.id)}
                  className={items.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))
            }
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>

      <Alert isHiden={alertHidden} message={alertMessage} hasError={alertError} />
    </div>
  );
}

export default CreatePoint;