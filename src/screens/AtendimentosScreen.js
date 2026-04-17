// src/screens/AtendimentosScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';
import { TIPOS_TRATAMENTO, hojeISO } from '../data/dadosIniciais';
import AtendimentoCard from '../components/AtendimentoCard';

export default function AtendimentosScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { pacientes, adicionarAtendimento, getUltimosAtendimentos, getPaciente } = useApp();
  const [form, setForm]     = useState({ pacienteId: '', data: hojeISO(), tipo: '', observacoes: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errors[campo]) setErrors((prev) => ({ ...prev, [campo]: '' }));
  };

  const validar = () => {
    const e = {};
    if (!form.pacienteId) e.pacienteId = 'Selecione um paciente.';
    if (!form.data)       e.data       = 'Data é obrigatória.';
    if (!form.tipo)       e.tipo       = 'Selecione o tratamento.';
    return e;
  };

  const handleSalvar = () => {
    const erros = validar();
    if (Object.keys(erros).length > 0) { setErrors(erros); return; }
    const pac = getPaciente(parseInt(form.pacienteId));
    adicionarAtendimento({
      pacienteId: parseInt(form.pacienteId),
      data: form.data,
      tipo: form.tipo,
      observacoes: form.observacoes.trim(),
    });
    Alert.alert('✅ Registrado!', `Sessão de ${pac?.nome} salva.`, [
      { text: 'OK', onPress: () => {
        setForm({ pacienteId: '', data: hojeISO(), tipo: '', observacoes: '' });
        navigation.goBack();
      }},
    ]);
  };

  const recentes = getUltimosAtendimentos(5);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📋 Novo Atendimento</Text>
        <Text style={styles.headerSub}>Registre a sessão do paciente</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>

            <Text style={styles.label}>Paciente *</Text>
            <View style={[styles.pickerBox, errors.pacienteId && styles.inputError]}>
              <Picker selectedValue={form.pacienteId} onValueChange={(v) => handleChange('pacienteId', v)}>
                <Picker.Item label="— Selecione o paciente —" value="" />
                {pacientes.map((p) => <Picker.Item key={p.id} label={`${p.nome} (${p.idade} anos)`} value={String(p.id)} />)}
              </Picker>
            </View>
            {errors.pacienteId ? <Text style={styles.error}>⚠️ {errors.pacienteId}</Text> : null}

            <Text style={styles.label}>Data *</Text>
            <TextInput style={[styles.input, errors.data && styles.inputError]} value={form.data} onChangeText={(v) => handleChange('data', v)} placeholder="AAAA-MM-DD" placeholderTextColor={COLORS.textLight} />
            {errors.data ? <Text style={styles.error}>⚠️ {errors.data}</Text> : null}

            <Text style={styles.label}>Tipo de Tratamento *</Text>
            <View style={[styles.pickerBox, errors.tipo && styles.inputError]}>
              <Picker selectedValue={form.tipo} onValueChange={(v) => handleChange('tipo', v)}>
                <Picker.Item label="— Selecione o tratamento —" value="" />
                {TIPOS_TRATAMENTO.map((t) => <Picker.Item key={t} label={t} value={t} />)}
              </Picker>
            </View>
            {errors.tipo ? <Text style={styles.error}>⚠️ {errors.tipo}</Text> : null}

            <Text style={styles.label}>Evolução / Observações</Text>
            <TextInput style={[styles.input, { minHeight: 90 }]} placeholder="Ex: Dor reduziu de 7/10 para 4/10..." placeholderTextColor={COLORS.textLight} value={form.observacoes} onChangeText={(v) => handleChange('observacoes', v)} multiline textAlignVertical="top" />

            <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 16 }} />

            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSalvar}>
              <Text style={styles.btnText}>✅ Registrar Atendimento</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Atendimentos Recentes</Text>
          {recentes.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 36 }}>📭</Text>
              <Text style={styles.emptyText}>Nenhum atendimento ainda.</Text>
            </View>
          ) : (
            recentes.map((at) => (
              <TouchableOpacity key={at.id} activeOpacity={0.75}
                onPress={() => navigation.navigate('DetalheAtendimento', { atendimentoId: at.id })}>
                <AtendimentoCard atendimento={at} nomePaciente={getPaciente(at.pacienteId)?.nome} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: COLORS.primary },
  header:       { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn:      { color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 6 },
  headerTitle:  { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub:    { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll:       { flex: 1, backgroundColor: COLORS.bg },
  content:      { padding: 16 },
  card:         { backgroundColor: COLORS.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border, elevation: 3, marginBottom: 16 },
  label:        { fontSize: 12, fontWeight: '700', color: COLORS.textLight, marginBottom: 6, marginTop: 10, textTransform: 'uppercase' },
  input:        { backgroundColor: COLORS.bg, borderWidth: 2, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: COLORS.text },
  inputError:   { borderColor: COLORS.danger },
  pickerBox:    { backgroundColor: COLORS.bg, borderWidth: 2, borderColor: COLORS.border, borderRadius: 12, overflow: 'hidden' },
  error:        { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  btn:          { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnPrimary:   { backgroundColor: COLORS.primary },
  btnText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  empty:        { alignItems: 'center', paddingVertical: 32 },
  emptyText:    { fontSize: 14, color: COLORS.textLight, marginTop: 8 },
});