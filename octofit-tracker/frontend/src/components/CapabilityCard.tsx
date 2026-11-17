import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Props = {
  title: string;
  description: string;
  emptyMessage: string;
  renderContent: (data: unknown) => React.ReactNode;
  fetchData: () => Promise<unknown>;
};

export function CapabilityCard({ title, description, emptyMessage, renderContent, fetchData }: Props) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchData()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load data. Please try again later.');
        setLoading(false);
      });
  }, [fetchData]);

  let content: React.ReactNode = null;
  if (loading) {
    content = <p role="status">Loading...</p>;
  } else if (error) {
    content = <div role="alert" className="alert alert-danger">{error}</div>;
  } else if (data) {
    content = renderContent(data);
  } else {
    content = <p>{emptyMessage}</p>;
  }

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {content}
      </div>
    </section>
  );
}
