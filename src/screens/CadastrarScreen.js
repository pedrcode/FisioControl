import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';

export default function CadastrarScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { adicionarPaciente } = useApp();
  const [form, setForm]     = useState({ nome: '', idade: '', telefone: '', observacoes: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errors[campo]) setErrors((prev) => ({ ...prev, [campo]: '' }));
  };

  const formatarTelefone = (v) => {
    const n = v.replace(/\D/g, '').slice(0, 11);
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 7) return `(${n.slice(0,2)}) ${n.slice(2)}`;
    return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  };

  const validar = () => {
    const e = {};
    if (!form.nome.trim())                                              e.nome     = 'Nome é obrigatório.';
    if (!form.idade || isNaN(form.idade) || +form.idade < 1)           e.idade    = 'Informe uma idade válida.';
    if (!form.telefone || form.telefone.replace(/\D/g,'').length < 10) e.telefone = 'Telefone inválido.';
    return e;
  };

  const handleSalvar = () => {
    const erros = validar();
    if (Object.keys(erros).length > 0) { setErrors(erros); return; }
    adicionarPaciente({ nome: form.nome.trim(), idade: parseInt(form.idade), telefone: form.telefone, observacoes: form.observacoes.trim() });
    Alert.alert('✅ Sucesso!', `${form.nome} cadastrado(a)!`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>➕ Cadastrar Paciente</Text>
        <Text style={styles.headerSub}>Campos com * são obrigatórios</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput style={[styles.input, errors.nome && styles.inputError]} placeholder="Ex: Ana Paula Silva" placeholderTextColor={COLORS.textLight} value={form.nome} onChangeText={(v) => handleChange('nome', v)} autoCapitalize="words" />
            {errors.nome ? <Text style={styles.error}>⚠️ {errors.nome}</Text> : null}

            <Text style={styles.label}>Idade *</Text>
            <TextInput style={[styles.input, errors.idade && styles.inputError]} placeholder="Ex: 35" placeholderTextColor={COLORS.textLight} value={form.idade} onChangeText={(v) => handleChange('idade', v.replace(/\D/g,''))} keyboardType="numeric" maxLength={3} />
            {errors.idade ? <Text style={styles.error}>⚠️ {errors.idade}</Text> : null}

            <Text style={styles.label}>Telefone *</Text>
            <TextInput style={[styles.input, errors.telefone && styles.inputError]} placeholder="(11) 99999-9999" placeholderTextColor={COLORS.textLight} value={form.telefone} onChangeText={(v) => handleChange('telefone', formatarTelefone(v))} keyboardType="phone-pad" maxLength={15} />
            {errors.telefone ? <Text style={styles.error}>⚠️ {errors.telefone}</Text> : null}

            <Text style={styles.label}>Observações</Text>
            <TextInput style={[styles.input, { minHeight: 90 }]} placeholder="Histórico clínico, alergias..." placeholderTextColor={COLORS.textLight} value={form.observacoes} onChangeText={(v) => handleChange('observacoes', v)} multiline textAlignVertical="top" />

            <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 16 }} />

            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSalvar}>
              <Text style={styles.btnText}>💾 Salvar Paciente</Text>
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
  error:          { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  btn:            { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnPrimary:     { backgroundColor: COLORS.primary },
  btnOutline:     { borderWidth: 2, borderColor: COLORS.primary },
  btnText:        { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextOutline: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});