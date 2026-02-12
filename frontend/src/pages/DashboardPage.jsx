import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import KpiTable from '../components/KpiTable';
import ChartCard from '../components/ChartCard';

export default function DashboardPage() {
  const { surveyId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/surveys/${surveyId}/dashboard`).then((res) => setData(res.data));
  }, [surveyId]);

  const downloadReport = async () => {
    const response = await api.get(`/surveys/${surveyId}/report`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-report-${surveyId}.pptx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!data) return <div className="page">Loading dashboard...</div>;

  return (
    <div className="page">
      <h1>{data.fileName}</h1>
      <button onClick={downloadReport}>Download PPT Report</button>
      <p className="insight">AI Insight: {data.insight.summary}</p>
      <KpiTable kpis={data.kpis} />
      <div className="grid">
        {data.charts.map((chart) => (
          <ChartCard key={chart.question} chart={chart} />
        ))}
      </div>
      <div className="card">
        <h3>Significance Testing</h3>
        <pre>{JSON.stringify(data.significance, null, 2)}</pre>
      </div>
    </div>
  );
}
