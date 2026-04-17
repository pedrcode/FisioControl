import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList,
  StyleSheet, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';
import { formatarData } from '../data/dadosIniciais';

export default function HistoricoScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { pacienteId } = route.params || {};
  const { pacientes, atendimentos, getPaciente, getAtendimentosDoPaciente, excluirPaciente } = useApp();

  if (!pacienteId) {
    return (
      <View style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📅 Histórico</Text>
          <Text style={styles.headerSub}>Selecione um paciente</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 16 }}>
          <FlatList
            data={pacientes}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={{ fontSize: 36 }}>📭</Text>
                <Text style={styles.emptyText}>Nenhum paciente cadastrado.</Text>
              </View>
            }
            renderItem={({ item }) => {
              const numAt = atendimentos.filter((a) => a.pacienteId === item.id).length;
              return (
                <TouchableOpacity
                  style={styles.patientRow}
                  onPress={() => navigation.push('Historico', { pacienteId: item.id })}
                  activeOpacity={0.75}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.nome.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.patientName}>{item.nome}</Text>
                    <Text style={styles.patientInfo}>{item.idade} anos</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{numAt} sessões</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    );
  }

  const paciente  = getPaciente(pacienteId);
  const historico = getAtendimentosDoPaciente(pacienteId);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📅 Histórico</Text>
        <Text style={styles.headerSub}>{paciente?.nome}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}>

        {/* CARD DO PACIENTE */}
        <View style={styles.pacienteCard}>
          <Text style={styles.pacienteNome}>{paciente?.nome}</Text>
          <Text style={styles.pacienteInfo}>🎂 {paciente?.idade} anos  •  📞 {paciente?.telefone}</Text>
          {paciente?.observacoes ?
            <Text style={styles.pacienteObs}>📝 {paciente.observacoes}</Text>
          : null}

          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() => navigation.navigate('EditarPaciente', { pacienteId })}
          >
            <Text style={styles.btnEditarText}>✏️ Editar Cadastro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnExcluir}
            onPress={() => {
              Alert.alert(
                '🗑️ Excluir Paciente',
                `Deseja excluir ${paciente?.nome}?\n\nTodos os atendimentos também serão apagados.`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                      excluirPaciente(pacienteId);
                      navigation.goBack();
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.btnExcluirText}>🗑️ Excluir Paciente</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>📋 Histórico de Sessões ({historico.length})</Text>

        {historico.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>📭</Text>
            <Text style={styles.emptyText}>Nenhuma sessão registrada.</Text>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, { marginTop: 16, paddingHorizontal: 24 }]}
              onPress={() => navigation.navigate('NovoAtendimento')}
            >
              <Text style={styles.btnText}>➕ Registrar Sessão</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.timeline}>
            <View style={styles.timelineLine} />
            {historico.map((at, idx) => (
              <TouchableOpacity
                key={at.id}
                style={styles.timelineItem}
                onPress={() => navigation.navigate('DetalheAtendimento', { atendimentoId: at.id })}
                activeOpacity={0.75}
              >
                <View style={[styles.dot, idx === 0 && styles.dotActive]} />
                <View style={[styles.sessaoCard, idx === 0 && styles.sessaoDestaque]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sessaoData}>📅 {formatarData(at.data)}</Text>
                      <Text style={styles.sessaoTipo}>🩺 {at.tipo}</Text>
                      {at.observacoes ?
                        <Text style={styles.sessaoObs} numberOfLines={2}>{at.observacoes}</Text>
                      : null}
                    </View>
                    <Text style={{ fontSize: 18, color: COLORS.textLight }}>›</Text>
                  </View>
                  {idx === 0 &&
                    <View style={styles.recenteBadge}>
                      <Text style={styles.recenteText}>Mais recente</Text>
                    </View>
                  }
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {historico.length > 0 && (
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline, { marginTop: 8 }]}
            onPress={() => navigation.navigate('NovoAtendimento')}
          >
            <Text style={styles.btnTextOutline}>➕ Nova Sessão</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: COLORS.primaryDark },
  header:         { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn:        { color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 6 },
  headerTitle:    { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub:      { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll:         { flex: 1, backgroundColor: COLORS.bg },
  content:        { padding: 16 },
  sectionTitle:   { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  pacienteCard:   { backgroundColor: COLORS.primary, borderRadius: 18, padding: 18, marginBottom: 20 },
  pacienteNome:   { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4 },
  pacienteInfo:   { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  pacienteObs:    { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 10 },
  btnEditar:      { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  btnEditarText:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnExcluir:     { backgroundColor: 'rgba(230,57,70,0.2)', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: 'rgba(230,57,70,0.5)' },
  btnExcluirText: { color: '#ffaaaa', fontWeight: '700', fontSize: 14 },
  timeline:       { paddingLeft: 24, position: 'relative' },
  timelineLine:   { position: 'absolute', left: 31, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.border },
  timelineItem:   { position: 'relative', marginBottom: 14 },
  dot:            { position: 'absolute', left: -17, top: 14, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.border, zIndex: 1 },
  dotActive:      { backgroundColor: COLORS.primary },
  sessaoCard:     { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: COLORS.textLight, elevation: 1 },
  sessaoDestaque: { borderLeftColor: COLORS.primary },
  sessaoData:     { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 3 },
  sessaoTipo:     { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  sessaoObs:      { fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
  recenteBadge:   { backgroundColor: '#E0F0FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 8 },
  recenteText:    { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  patientRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, elevation: 1 },
  avatar:         { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText:     { color: '#fff', fontSize: 20, fontWeight: '800' },
  patientName:    { fontSize: 15, fontWeight: '700', color: COLORS.text },
  patientInfo:    { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  badge:          { backgroundColor: '#E0F0FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:      { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  empty:          { alignItems: 'center', paddingVertical: 32 },
  emptyText:      { fontSize: 14, color: COLORS.textLight, marginTop: 8 },
  btn:            { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnPrimary:     { backgroundColor: COLORS.primary },
  btnOutline:     { borderWidth: 2, borderColor: COLORS.primary },
  btnText:        { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextOutline: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});