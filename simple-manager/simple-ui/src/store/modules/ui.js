import {SHOW_LOADING, HIDE_LOADING, SHOW_ALERT, HIDE_ALERT} from '../types';

const state = {
  loading: false,
  loadingTitle: '',
  loadingMessage: '',
  alert: false,
  alertTitle: '',
  alertMessage: '',
};

const getters = {};

const mutations = {
  [SHOW_LOADING]: (state, payload) => {
    state.loading = true;
    state.loadingTitle = payload.title || '';
    state.loadingMessage = payload.message || '';
  },
  [HIDE_LOADING]: (state) => {
    state.loading = false;
    state.loadingTitle = '';
    state.loadingMessage = '';
  },
  [SHOW_ALERT]: (state, payload) => {
    state.alert = true;
    state.alertTitle = payload.title || '';
    state.alertMessage = payload.message || '';
  },
  [HIDE_ALERT]: (state) => {
    state.alert = false;
    state.alertTitle = '';
    state.alertMessage = '';
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}