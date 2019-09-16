import { SHOW_LOADING, HIDE_LOADING, SHOW_ALERT, HIDE_ALERT, APPEND_ADB_LOGGER, APPEND_SERVICE_LOGGER } from '../types';

const bufLimit = 500;
function appendLineToBuf(buf, line) {
  if (buf.length > bufLimit) {
    buf.pop();
  }
  buf.unshift(line);
}

const state = {
  loading: false,
  loadingTitle: '',
  loadingMessage: '',
  alert: false,
  alertTitle: '',
  alertMessage: '',
  adbLoggerBuf: ['Hello, this is adb logger'],
  serviceLoggerBuf: ['Hello, this is service logger'],
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
  },
  [APPEND_ADB_LOGGER]: (state, payload) => {
    appendLineToBuf(state.adbLoggerBuf, payload);
  },
  [APPEND_SERVICE_LOGGER]: (state, payload) => {
    appendLineToBuf(state.serviceLoggerBuf, payload);
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}