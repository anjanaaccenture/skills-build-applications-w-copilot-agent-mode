import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Props = {
  title: string;
  description: string;
  apiPath: string;
  emptyMessage: string;
  renderContent: (data: unknown) => React.ReactNode;
};

export function CapabilityCard({ title, description, apiPath, emptyMessage, renderContent }: Props) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getJson(apiPath)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load data. Please try again later.');
        setLoading(false);
      });
  }, [apiPath]);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {loading && <p role="status">Loading...</p>}
        {error && <div role="alert" className="alert alert-danger">{error}</div>}
        {!loading && !error && data && renderContent(data)}
        {!loading && !error && !data && <p>{emptyMessage}</p>}
      </div>
    </section>
  );
}
