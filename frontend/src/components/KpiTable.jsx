export default function KpiTable({ kpis }) {
  return (
    <div className="card">
      <h3>KPI Metrics</h3>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Responses</th>
            <th>Mean</th>
            <th>Top-box</th>
            <th>Bottom-box</th>
            <th>NPS</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi) => (
            <tr key={kpi.question}>
              <td>{kpi.question}</td>
              <td>{kpi.responseCount}</td>
              <td>{kpi.meanScore}</td>
              <td>{kpi.topBox}%</td>
              <td>{kpi.bottomBox}%</td>
              <td>{kpi.nps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
