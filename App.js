import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [dadosPaises, setDadosPaises] = useState([]);
  const [input, setInput] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await fetch('https://api-paises.pages.dev/paises.json');
      const dados = await response.json();
      setDadosPaises(Object.values(dados) || []); 
    } catch (error) {
      console.error('Erro ao carregar os dados dos países:', error);
    }
  };

  const sugerirPaises = (input) => {
    const paisesFiltrados = dadosPaises.filter(pais =>
      pais.pais.toLowerCase().includes(input.toLowerCase())
    );
    setSugestoes(paisesFiltrados);
  };

  const buscarPais = () => {
    const paisEncontrado = dadosPaises.find(pais =>
      pais.pais.toLowerCase() === input.toLowerCase()
    );
    setResultado(paisEncontrado || null); 
    setSugestoes([]); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Países</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do país"
        autoCompleteType="off"
        value={input}
        onChangeText={(text) => {
          setInput(text);
          sugerirPaises(text);
        }}
      />
      <Button title="Buscar" onPress={buscarPais} />

      {sugestoes.length > 0 && (
        <FlatList
          data={sugestoes}
          keyExtractor={(item) => item.pais}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setInput(item.pais);
              setSugestoes([]); 
              buscarPais();
            }}>
              <View style={styles.sugestao}>
                <Image source={{ uri: item.img }} style={styles.bandeira} />
                <Text>{item.pais} (DDI: +{item.ddi}) - {item.continente}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {resultado && (
        <View style={styles.resultado}>
          <Image source={{ uri: resultado.img }} style={styles.bandeira} />
          <Text><Text style={styles.bold}>País:</Text> {resultado.pais}</Text>
          <Text><Text style={styles.bold}>DDI:</Text> +{resultado.ddi}</Text>
          <Text><Text style={styles.bold}>Continente:</Text> {resultado.continente}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text>Entre em contato:</Text>
        <Text>Email: <Text style={styles.link} onPress={() => Linking.openURL('mailto:2004biel2005@gmail.com')}>2004biel2005@gmail.com</Text></Text>
        <Text>WhatsApp: <Text style={styles.link} onPress={() => Linking.openURL('https://wa.me/5581999999999')}>Clique aqui</Text></Text>
        <Text>Nosso Endereço: <Text style={styles.link} onPress={() => Linking.openURL('https://www.google.com/maps?q=-8.0477039,-34.9359074')}>Ver no mapa</Text></Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  sugestao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bandeira: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
  resultado: {
    marginTop: 20,
    alignItems: 'center',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
});
