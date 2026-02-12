const fs = require('fs');
const path = require('path');
const { getDb } = require('../config/db');
const { uploadDir } = require('../config/env');
const { parseSurveyFile, computeQuestionMetrics, buildChartData } = require('../services/surveyService');
const { runSignificance, generatePpt, generateInsight } = require('../services/pythonClient');

async function uploadSurvey(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an .xlsx survey file.' });
  }

  const parsed = await parseSurveyFile(req.file.path);
  const db = await getDb();

  const metadata = {
    headers: parsed.headers,
    questionColumns: parsed.questionColumns,
    rowCount: parsed.rowCount
  };

  const insert = await db.run(
    'INSERT INTO surveys (user_id, original_name, stored_name, metadata_json) VALUES (?, ?, ?, ?)',
    [req.user.id, req.file.originalname, req.file.filename, JSON.stringify(metadata)]
  );

  const surveyId = insert.lastID;

  for (const row of parsed.rows) {
    await db.run('INSERT INTO survey_rows (survey_id, row_json) VALUES (?, ?)', [surveyId, JSON.stringify(row)]);
  }

  return res.json({
    message: 'Survey uploaded successfully.',
    surveyId,
    metadata
  });
}

async function getDashboard(req, res) {
  const surveyId = Number(req.params.id);
  const db = await getDb();
  const survey = await db.get('SELECT * FROM surveys WHERE id = ? AND user_id = ?', [surveyId, req.user.id]);

  if (!survey) {
    return res.status(404).json({ message: 'Survey not found.' });
  }

  const rowsRaw = await db.all('SELECT row_json FROM survey_rows WHERE survey_id = ?', [surveyId]);
  const rows = rowsRaw.map((entry) => JSON.parse(entry.row_json));
  const metadata = JSON.parse(survey.metadata_json || '{}');

  const kpis = metadata.questionColumns.map((column) => computeQuestionMetrics(rows, column));
  const charts = kpis.map((metric) => buildChartData(metric));

  const significance = await runSignificance({ rows, questionColumns: metadata.questionColumns, groupColumn: 'Segment' });
  const insight = await generateInsight({ kpis, significance });

  return res.json({ surveyId, fileName: survey.original_name, kpis, charts, significance, insight });
}

async function listSurveys(req, res) {
  const db = await getDb();
  const surveys = await db.all(
    'SELECT id, original_name, uploaded_at, metadata_json FROM surveys WHERE user_id = ? ORDER BY uploaded_at DESC',
    [req.user.id]
  );
  return res.json(
    surveys.map((survey) => ({
      ...survey,
      metadata: JSON.parse(survey.metadata_json || '{}')
    }))
  );
}

async function generateReport(req, res) {
  const surveyId = Number(req.params.id);
  const db = await getDb();
  const survey = await db.get('SELECT * FROM surveys WHERE id = ? AND user_id = ?', [surveyId, req.user.id]);
  if (!survey) {
    return res.status(404).json({ message: 'Survey not found.' });
  }

  const rowsRaw = await db.all('SELECT row_json FROM survey_rows WHERE survey_id = ?', [surveyId]);
  const rows = rowsRaw.map((entry) => JSON.parse(entry.row_json));
  const metadata = JSON.parse(survey.metadata_json || '{}');
  const kpis = metadata.questionColumns.map((column) => computeQuestionMetrics(rows, column));
  const chartPayload = kpis.map((metric) => buildChartData(metric));
  const significance = await runSignificance({ rows, questionColumns: metadata.questionColumns, groupColumn: 'Segment' });
  const insight = await generateInsight({ kpis, significance });

  const report = await generatePpt({
    title: `Survey Report - ${survey.original_name}`,
    kpis,
    charts: chartPayload,
    insight: insight.summary
  });

  const outputPath = path.resolve(uploadDir, report.filename);
  if (!fs.existsSync(outputPath)) {
    return res.status(500).json({ message: 'Report generation failed.' });
  }

  return res.download(outputPath, report.filename);
}

module.exports = {
  uploadSurvey,
  getDashboard,
  listSurveys,
  generateReport
};
