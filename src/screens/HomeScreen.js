import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';
import AtendimentoCard from '../components/AtendimentoCard';
import { hojeISO } from '../data/dadosIniciais';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { pacientes, atendimentos, getUltimosAtendimentos, getPaciente } = useApp();

  const hoje      = hojeISO();
  const atendHoje = atendimentos.filter((a) => a.data === hoje).length;
  const ultimos   = getUltimosAtendimentos(3);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🦴 FisioControl</Text>
        <Text style={styles.headerSub}>Gestão de Atendimentos</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}>
        <View style={styles.statRow}>
          <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('PacientesTab')}>
            <Text style={styles.statNum}>{pacientes.length}</Text>
            <Text style={styles.statLabel}>👤 Pacientes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('AtendimentosTab')}>
            <Text style={styles.statNum}>{atendimentos.length}</Text>
            <Text style={styles.statLabel}>📋 Atendimentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('AtendimentosTab')}>
            <Text style={[styles.statNum, { color: atendHoje > 0 ? COLORS.success : COLORS.primary }]}>
              {atendHoje}
            </Text>
            <Text style={styles.statLabel}>📅 Hoje</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary, { flex: 1, marginRight: 8 }]}
            onPress={() => navigation.navigate('Cadastrar')}>
            <Text style={styles.btnText}>➕ Novo Paciente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnOutline, { flex: 1 }]}
            onPress={() => navigation.navigate('NovoAtendimento')}>
            <Text style={styles.btnTextOutline}>📋 Atendimento</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Últimos Atendimentos</Text>
        {ultimos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>📭</Text>
            <Text style={styles.emptyText}>Nenhum atendimento ainda.</Text>
          </View>
        ) : (
          ultimos.map((at) => (
            <TouchableOpacity key={at.id} activeOpacity={0.75}
              onPress={() => navigation.navigate('DetalheAtendimento', { atendimentoId: at.id })}>
              <AtendimentoCard atendimento={at} nomePaciente={getPaciente(at.pacienteId)?.nome} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: COLORS.primary },
  header:         { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle:    { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub:      { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll:         { flex: 1, backgroundColor: COLORS.bg },
  content:        { padding: 16 },
  statRow:        { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 8 },
  statBox:        { flex: 1, backgroundColor: COLORS.card, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
  statNum:        { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  statLabel:      { fontSize: 10, color: COLORS.textLight, marginTop: 2, textAlign: 'center' },
  sectionTitle:   { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  actionsRow:     { flexDirection: 'row', marginBottom: 20 },
  btn:            { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnPrimary:     { backgroundColor: COLORS.primary },
  btnOutline:     { borderWidth: 2, borderColor: COLORS.primary },
  btnText:        { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnTextOutline: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  empty:          { alignItems: 'center', paddingVertical: 32 },
  emptyText:      { fontSize: 14, color: COLORS.textLight, marginTop: 8 },
});