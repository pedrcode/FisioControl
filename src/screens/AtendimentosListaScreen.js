import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';
import { formatarData } from '../data/dadosIniciais';

export default function AtendimentosListaScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { atendimentos, getPaciente } = useApp();
  const [busca, setBusca] = useState('');

  const todos = [...atendimentos]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .filter((at) => {
      const pac = getPaciente(at.pacienteId);
      return pac?.nome.toLowerCase().includes(busca.toLowerCase());
    });

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Atendimentos</Text>
        <Text style={styles.headerSub}>{atendimentos.length} registrado(s)</Text>
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 80 }]}>
        <View style={styles.searchBox}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por paciente..."
            placeholderTextColor={COLORS.textLight}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 &&
            <TouchableOpacity onPress={() => setBusca('')}>
              <Text style={{ color: COLORS.textLight }}>✕</Text>
            </TouchableOpacity>
          }
        </View>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]}
          onPress={() => navigation.navigate('NovoAtendimento')}>
          <Text style={styles.btnText}>➕ Registrar Novo Atendimento</Text>
        </TouchableOpacity>

        <FlatList
          data={todos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 36 }}>📭</Text>
              <Text style={styles.emptyText}>Nenhum atendimento registrado.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const pac = getPaciente(item.pacienteId);
            return (
              <TouchableOpacity style={styles.card}
                onPress={() => navigation.navigate('DetalheAtendimento', { atendimentoId: item.id })}
                activeOpacity={0.75}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardData}>📅 {formatarData(item.data)}</Text>
                  <Text style={styles.cardPaciente}>👤 {pac?.nome}</Text>
                  <Text style={styles.cardTipo}>🩺 {item.tipo}</Text>
                  {item.observacoes ?
                    <Text style={styles.cardObs} numberOfLines={1}>"{item.observacoes}"</Text>
                  : null}
                </View>
                <Text style={styles.seta}>›</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: COLORS.primary },
  header:       { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle:  { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub:    { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  content:      { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  searchBox:    { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  searchInput:  { flex: 1, fontSize: 14, color: COLORS.text },
  btn:          { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 14 },
  btnPrimary:   { backgroundColor: COLORS.primary },
  btnText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
  card:         { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4, borderLeftColor: COLORS.primary, elevation: 2 },
  cardLeft:     { flex: 1 },
  cardData:     { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 3 },
  cardPaciente: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  cardTipo:     { fontSize: 13, color: COLORS.textLight, marginBottom: 3 },
  cardObs:      { fontSize: 12, color: COLORS.textLight, fontStyle: 'italic' },
  seta:         { fontSize: 22, color: COLORS.textLight },
  empty:        { alignItems: 'center', paddingVertical: 40 },
  emptyText:    { fontSize: 14, color: COLORS.textLight, marginTop: 8 },
});