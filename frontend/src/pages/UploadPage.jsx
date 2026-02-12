import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/surveys').then(({ data }) => setSurveys(data));
  }, []);

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('surveyFile', file);
    const { data } = await api.post('/surveys/upload', formData);
    setMessage(data.message);
    navigate(`/dashboard/${data.surveyId}`);
  };

  return (
    <div className="page">
      <h1>Upload Survey File</h1>
      <div className="card">
        <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={upload}>Generate Dashboard</button>
        {message && <p>{message}</p>}
      </div>

      <div className="card">
        <h3>Recent Surveys</h3>
        {surveys.map((survey) => (
          <div key={survey.id} className="survey-item">
            <span>{survey.original_name}</span>
            <button onClick={() => navigate(`/dashboard/${survey.id}`)}>Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}
