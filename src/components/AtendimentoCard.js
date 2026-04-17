// src/components/AtendimentoCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';
import { formatarData } from '../data/dadosIniciais';

export default function AtendimentoCard({ atendimento, nomePaciente, destaque = false }) {
  return (
    <View style={[styles.card, destaque && styles.cardDestaque]}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.data}>📅 {formatarData(atendimento.data)}</Text>
          <Text style={styles.tipo}>{atendimento.tipo}</Text>
          {nomePaciente && <Text style={styles.paciente}>👤 {nomePaciente}</Text>}
          {atendimento.observacoes ? <Text style={styles.obs}>{atendimento.observacoes}</Text> : null}
        </View>
        <View style={[styles.badge, destaque && styles.badgeDestaque]}>
          <Text style={[styles.badgeText, destaque && styles.badgeTextDestaque]}>
            {destaque ? 'Recente' : '✓'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    marginBottom: 10, borderLeftWidth: 4, borderLeftColor: COLORS.textLight,
    elevation: 1,
  },
  cardDestaque:        { borderLeftColor: COLORS.primary },
  row:                 { flexDirection: 'row', alignItems: 'flex-start' },
  data:                { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 3 },
  tipo:                { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  paciente:            { fontSize: 13, color: COLORS.textLight, marginBottom: 4 },
  obs:                 { fontSize: 13, color: COLORS.textLight, fontStyle: 'italic', marginTop: 4 },
  badge:               { backgroundColor: '#E0F8EA', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginLeft: 8 },
  badgeDestaque:       { backgroundColor: '#E0F0FF' },
  badgeText:           { fontSize: 11, fontWeight: '700', color: COLORS.success },
  badgeTextDestaque:   { color: COLORS.primary },
});