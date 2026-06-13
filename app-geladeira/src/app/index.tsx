import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [dados, setDados] = useState(null);
  
  // Mude para o seu IPv4 aqui:
  const IP_MAQUINA = '192.168.0.15'; 

  const buscarDados = async () => {
    try {
      const response = await fetch(`http://${IP_MAQUINA}:3000/api/historico/posto_centro_01`);
      const json = await response.json();
      setDados(json);
    } catch (error) {
      console.error("Erro ao buscar API:", error);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Central de Saúde 🏥</Text>
      
      {dados && dados.length > 0 ? (
        <View style={styles.card}>
          <Text>Geladeira: {dados[0].geladeira_id}</Text>
          <Text>Leituras na Hora: {dados[0].quantidade_leituras}</Text>
          <Text style={styles.temp}>
            Última Temp: {dados[0].leituras[dados[0].leituras.length - 1].temperatura}°C
          </Text>
        </View>
      ) : (
        <Text>Aguardando dados...</Text>
      )}

      <Button title="Atualizar Dados" onPress={buscarDados} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 10, elevation: 3, marginBottom: 20 },
  temp: { fontSize: 18, color: 'red', marginTop: 10, fontWeight: 'bold' }
});