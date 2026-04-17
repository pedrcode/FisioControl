// src/components/PacienteCard.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

export default function PacienteCard({ paciente, numAtendimentos, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{paciente.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome}>{paciente.nome}</Text>
        <Text style={styles.detalhe}>🎂 {paciente.idade} anos  •  📞 {paciente.telefone}</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{numAtendimentos} sessões</Text>
        </View>
        <Text style={styles.seta}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
    elevation: 2,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText:  { color: '#fff', fontSize: 20, fontWeight: '800' },
  info:        { flex: 1 },
  nome:        { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  detalhe:     { fontSize: 12, color: COLORS.textLight },
  right:       { alignItems: 'flex-end' },
  badge:       { backgroundColor: '#E0F0FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 4 },
  badgeText:   { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  seta:        { fontSize: 20, color: COLORS.textLight },
});