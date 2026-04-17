import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';
import { formatarData } from '../data/dadosIniciais';

export default function DetalheAtendimentoScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { atendimentoId } = route.params;
  const { atendimentos, getPaciente, excluirAtendimento } = useApp();

  const atendimento = atendimentos.find((a) => a.id === atendimentoId);
  const paciente    = atendimento ? getPaciente(atendimento.pacienteId) : null;

  if (!atendimento) {
    return (
      <View style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={{ padding: 20 }}>
          <Text style={{ color: COLORS.danger }}>Atendimento não encontrado.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📋 Detalhe do Atendimento</Text>
        <Text style={styles.headerSub}>{formatarData(atendimento.data)}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>👤 PACIENTE</Text>
          <Text style={styles.mainText}>{paciente?.nome}</Text>
          <Text style={styles.subText}>🎂 {paciente?.idade} anos  •  📞 {paciente?.telefone}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>📅 DATA</Text>
          <Text style={styles.mainText}>{formatarData(atendimento.data)}</Text>
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>🩺 TIPO DE TRATAMENTO</Text>
          <Text style={styles.mainText}>{atendimento.tipo}</Text>
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>📝 EVOLUÇÃO / OBSERVAÇÕES</Text>
          <Text style={styles.obsText}>
            {atendimento.observacoes || 'Nenhuma observação registrada.'}
          </Text>
        </View>

        <TouchableOpacity style={[styles.btn, styles.btnOutline]}
          onPress={() => navigation.navigate('EditarAtendimento', { atendimentoId })}>
          <Text style={styles.btnTextOutline}>✏️ Editar Atendimento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnExcluir]}
          onPress={() => {
            Alert.alert(
              '🗑️ Excluir Atendimento',
              'Deseja excluir este atendimento?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir', style: 'destructive',
                  onPress: () => {
                    excluirAtendimento(atendimentoId);
                    navigation.goBack();
                  },
                },
              ]
            );
          }}>
          <Text style={styles.btnExcluirText}>🗑️ Excluir Atendimento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: COLORS.primary },
  header:         { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn:        { color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 6 },
  headerTitle:    { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub:      { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll:         { flex: 1, backgroundColor: COLORS.bg },
  content:        { padding: 16 },
  card:           { backgroundColor: COLORS.card, borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
  sectionLabel:   { fontSize: 11, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  mainText:       { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  subText:        { fontSize: 13, color: COLORS.textLight },
  obsText:        { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  divider:        { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
  btn:            { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 10 },
  btnOutline:     { borderWidth: 2, borderColor: COLORS.primary },
  btnTextOutline: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
  btnExcluir:     { backgroundColor: 'rgba(230,57,70,0.1)', borderWidth: 1, borderColor: 'rgba(230,57,70,0.4)' },
  btnExcluirText: { color: COLORS.danger, fontWeight: '700', fontSize: 15 },
});