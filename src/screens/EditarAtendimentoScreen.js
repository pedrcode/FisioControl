import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';
import { TIPOS_TRATAMENTO } from '../data/dadosIniciais';

export default function EditarAtendimentoScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { atendimentoId } = route.params;
  const { atendimentos, editarAtendimento, getPaciente } = useApp();

  const atendimento = atendimentos.find((a) => a.id === atendimentoId);
  const paciente    = atendimento ? getPaciente(atendimento.pacienteId) : null;

  const [form, setForm] = useState({
    data:        atendimento?.data        || '',
    tipo:        atendimento?.tipo        || '',
    observacoes: atendimento?.observacoes || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errors[campo]) setErrors((prev) => ({ ...prev, [campo]: '' }));
  };

  const validar = () => {
    const e = {};
    if (!form.data) e.data = 'Data é obrigatória.';
    if (!form.tipo) e.tipo = 'Selecione o tratamento.';
    return e;
  };

  const handleSalvar = () => {
    const erros = validar();
    if (Object.keys(erros).length > 0) { setErrors(erros); return; }
    editarAtendimento(atendimentoId, {
      data:        form.data,
      tipo:        form.tipo,
      observacoes: form.observacoes.trim(),
    });
    Alert.alert('✅ Salvo!', 'Atendimento atualizado com sucesso.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✏️ Editar Atendimento</Text>
        <Text style={styles.headerSub}>{paciente?.nome}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
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
            <TextInput style={[styles.input, { minHeight: 100 }]} placeholder="Ex: Paciente relatou melhora..." placeholderTextColor={COLORS.textLight} value={form.observacoes} onChangeText={(v) => handleChange('observacoes', v)} multiline textAlignVertical="top" />

            <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 16 }} />

            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSalvar}>
              <Text style={styles.btnText}>💾 Salvar Alterações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnOutline, { marginTop: 8 }]} onPress={() => navigation.goBack()}>
              <Text style={styles.btnTextOutline}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  card:           { backgroundColor: COLORS.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border, elevation: 3 },
  label:          { fontSize: 12, fontWeight: '700', color: COLORS.textLight, marginBottom: 6, marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  input:          { backgroundColor: COLORS.bg, borderWidth: 2, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: COLORS.text },
  inputError:     { borderColor: COLORS.danger },
  pickerBox:      { backgroundColor: COLORS.bg, borderWidth: 2, borderColor: COLORS.border, borderRadius: 12, overflow: 'hidden' },
  error:          { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  btn:            { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnPrimary:     { backgroundColor: COLORS.primary },
  btnOutline:     { borderWidth: 2, borderColor: COLORS.primary },
  btnText:        { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextOutline: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});