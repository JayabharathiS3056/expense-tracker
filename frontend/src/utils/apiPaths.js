export const API_BASE = '/api'

export const AUTH_ENDPOINTS = {
  REGISTER:     `${API_BASE}/auth/register`,
  LOGIN:        `${API_BASE}/auth/login`,
  ME:           `${API_BASE}/auth/me`,
  UPLOAD_IMAGE: `${API_BASE}/auth/upload-image`,
}

export const INCOME_ENDPOINTS = {
  ADD:            `${API_BASE}/income/add`,
  ALL:            `${API_BASE}/income/all`,
  DELETE:         (id) => `${API_BASE}/income/${id}`,
  DOWNLOAD_EXCEL: `${API_BASE}/income/download-excel`,
}

export const EXPENSE_ENDPOINTS = {
  ADD:            `${API_BASE}/expense/add`,
  ALL:            `${API_BASE}/expense/all`,
  DELETE:         (id) => `${API_BASE}/expense/${id}`,
  DOWNLOAD_EXCEL: `${API_BASE}/expense/download-excel`,
}

export const DASHBOARD_ENDPOINTS = {
  DATA: `${API_BASE}/dashboard`,
}