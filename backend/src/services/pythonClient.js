const axios = require('axios');
const { pythonServiceUrl } = require('../config/env');

async function runSignificance(payload) {
  const { data } = await axios.post(`${pythonServiceUrl}/significance`, payload);
  return data;
}

async function generatePpt(payload) {
  const { data } = await axios.post(`${pythonServiceUrl}/generate-ppt`, payload);
  return data;
}

async function generateInsight(payload) {
  const { data } = await axios.post(`${pythonServiceUrl}/insight`, payload);
  return data;
}

module.exports = { runSignificance, generatePpt, generateInsight };
