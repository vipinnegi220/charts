import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

export default function ChartCard({ chart }) {
  return (
    <div className="card chart-card">
      <h3>{chart.question}</h3>
      <div className="chart-grid">
        <Bar
          data={{ labels: chart.bar.labels, datasets: [{ label: 'Bar', data: chart.bar.values, backgroundColor: '#3b82f6' }] }}
        />
        <Pie
          data={{ labels: chart.pie.labels, datasets: [{ data: chart.pie.values, backgroundColor: ['#60a5fa', '#34d399', '#f59e0b', '#f43f5e', '#a78bfa'] }] }}
        />
        <Line
          data={{ labels: chart.trend.labels, datasets: [{ label: 'Trend', data: chart.trend.values, borderColor: '#10b981' }] }}
        />
        <Bar
          data={{
            labels: chart.waveComparison.labels,
            datasets: [{ label: 'Wave Comparison', data: chart.waveComparison.values, backgroundColor: ['#6366f1', '#fb7185'] }]
          }}
        />
      </div>
      <p className="stacked-note">
        Stacked score → Favorable {chart.stacked.favorable}% | Neutral {chart.stacked.neutral}% | Unfavorable {chart.stacked.unfavorable}%
      </p>
    </div>
  );
}
