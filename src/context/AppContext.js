import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

// Chaves do banco de dados local
const KEY_PACIENTES    = '@fisiocontrol:pacientes';
const KEY_ATENDIMENTOS = '@fisiocontrol:atendimentos';

export function AppProvider({ children }) {
  const [pacientes, setPacientes]       = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [carregando, setCarregando]     = useState(true);

  // ══════════════════════════════
  // CARREGAR DADOS AO ABRIR O APP
  // ══════════════════════════════
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [pacStr, atendStr] = await Promise.all([
        AsyncStorage.getItem(KEY_PACIENTES),
        AsyncStorage.getItem(KEY_ATENDIMENTOS),
      ]);
      if (pacStr)   setPacientes(JSON.parse(pacStr));
      if (atendStr) setAtendimentos(JSON.parse(atendStr));
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setCarregando(false);
    }
  };

  // ══════════════════════════════
  // SALVAR PACIENTES NO BANCO
  // ══════════════════════════════
  const salvarPacientes = async (lista) => {
    try {
      await AsyncStorage.setItem(KEY_PACIENTES, JSON.stringify(lista));
    } catch (e) {
      console.error('Erro ao salvar pacientes:', e);
    }
  };

  // ══════════════════════════════
  // SALVAR ATENDIMENTOS NO BANCO
  // ══════════════════════════════
  const salvarAtendimentos = async (lista) => {
    try {
      await AsyncStorage.setItem(KEY_ATENDIMENTOS, JSON.stringify(lista));
    } catch (e) {
      console.error('Erro ao salvar atendimentos:', e);
    }
  };

  // ══════════════════════════════
  // CRUD PACIENTES
  // ══════════════════════════════
  const adicionarPaciente = async (dados) => {
    const novo = {
      id: Date.now(),
      ...dados,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const nova = [...pacientes, novo];
    setPacientes(nova);
    await salvarPacientes(nova);
    return novo;
  };

  const editarPaciente = async (id, dados) => {
    const nova = pacientes.map((p) => p.id === id ? { ...p, ...dados } : p);
    setPacientes(nova);
    await salvarPacientes(nova);
  };

  const excluirPaciente = async (id) => {
    const novaPac   = pacientes.filter((p) => p.id !== id);
    const novaAtend = atendimentos.filter((a) => a.pacienteId !== id);
    setPacientes(novaPac);
    setAtendimentos(novaAtend);
    await salvarPacientes(novaPac);
    await salvarAtendimentos(novaAtend);
  };

  // ══════════════════════════════
  // CRUD ATENDIMENTOS
  // ══════════════════════════════
  const adicionarAtendimento = async (dados) => {
    const novo = { id: Date.now(), ...dados };
    const nova = [...atendimentos, novo];
    setAtendimentos(nova);
    await salvarAtendimentos(nova);
    return novo;
  };

  const editarAtendimento = async (id, dados) => {
    const nova = atendimentos.map((a) => a.id === id ? { ...a, ...dados } : a);
    setAtendimentos(nova);
    await salvarAtendimentos(nova);
  };

  const excluirAtendimento = async (id) => {
    const nova = atendimentos.filter((a) => a.id !== id);
    setAtendimentos(nova);
    await salvarAtendimentos(nova);
  };

  // ══════════════════════════════
  // HELPERS DE CONSULTA
  // ══════════════════════════════
  const getPaciente = (id) =>
    pacientes.find((p) => p.id === id);

  const getAtendimentosDoPaciente = (pacienteId) =>
    atendimentos
      .filter((a) => a.pacienteId === pacienteId)
      .sort((a, b) => new Date(b.data) - new Date(a.data));

  const getUltimosAtendimentos = (n = 5) =>
    [...atendimentos]
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, n);

  return (
    <AppContext.Provider value={{
      carregando,
      pacientes,
      atendimentos,
      adicionarPaciente,
      editarPaciente,
      excluirPaciente,
      adicionarAtendimento,
      editarAtendimento,
      excluirAtendimento,
      getPaciente,
      getAtendimentosDoPaciente,
      getUltimosAtendimentos,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}