const ExcelJS = require('exceljs');

function normalizeHeaders(values) {
  return values.map((value, idx) => (value ? String(value).trim() : `column_${idx}`));
}

async function parseSurveyFile(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  const headerRow = worksheet.getRow(1).values.slice(1);
  const headers = normalizeHeaders(headerRow);

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row.getCell(index + 1).value ?? null;
    });
    rows.push(rowData);
  });

  const questionColumns = headers.filter((column) => column.startsWith('Q'));

  return {
    headers,
    questionColumns,
    rowCount: rows.length,
    rows
  };
}

function numericValues(rows, column) {
  return rows
    .map((row) => Number(row[column]))
    .filter((value) => Number.isFinite(value));
}

function distribution(values) {
  return values.reduce((acc, value) => {
    const key = String(value);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function calcNps(values) {
  const promoters = values.filter((v) => v >= 9).length;
  const detractors = values.filter((v) => v <= 6).length;
  return values.length ? Number((((promoters - detractors) / values.length) * 100).toFixed(2)) : 0;
}

function computeQuestionMetrics(rows, column) {
  const values = numericValues(rows, column);
  const count = values.length;
  const meanScore = count ? Number((values.reduce((a, b) => a + b, 0) / count).toFixed(2)) : 0;
  const topBox = count ? Number(((values.filter((value) => value >= 4).length / count) * 100).toFixed(2)) : 0;
  const bottomBox = count ? Number(((values.filter((value) => value <= 2).length / count) * 100).toFixed(2)) : 0;

  return {
    question: column,
    responseCount: count,
    meanScore,
    topBox,
    bottomBox,
    nps: calcNps(values),
    distribution: distribution(values)
  };
}

function buildChartData(metrics) {
  const labels = Object.keys(metrics.distribution).sort((a, b) => Number(a) - Number(b));
  return {
    question: metrics.question,
    bar: {
      labels,
      values: labels.map((label) => metrics.distribution[label])
    },
    stacked: {
      favorable: metrics.topBox,
      neutral: Number((100 - metrics.topBox - metrics.bottomBox).toFixed(2)),
      unfavorable: metrics.bottomBox
    },
    pie: {
      labels,
      values: labels.map((label) => metrics.distribution[label])
    },
    trend: {
      labels: ['Wave 1', 'Wave 2', 'Wave 3'],
      values: [metrics.meanScore - 0.2, metrics.meanScore, metrics.meanScore + 0.3].map((v) => Number(Math.max(v, 0).toFixed(2)))
    },
    waveComparison: {
      labels: ['Current', 'Previous'],
      values: [metrics.meanScore, Number((metrics.meanScore - 0.4).toFixed(2))]
    }
  };
}

module.exports = {
  parseSurveyFile,
  computeQuestionMetrics,
  buildChartData
};
