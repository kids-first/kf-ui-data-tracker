import React, {useEffect, useState} from 'react';
import Ansi from 'ansi-to-react';

const Log = ({log}) => {
  const [loading, setLoading] = useState(false);
  const [logContents, setLogContents] = useState();

  useEffect(() => {
    const getData = () => {
      setLoading(true);
      fetch(log.downloadUrl, {
        headers: new Headers({
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        }),
      })
        .then(res => res.text())
        .then(content => {
          setLogContents(content);
          setLoading(false);
        });
    };

    if (log && log.downloadUrl) {
      getData();
    }
  }, [log]);

  if (loading) return <pre className="ansi terminal">Loading log...</pre>;

  return (
    <pre className="ansi terminal">
      <Ansi useClasses>{logContents}</Ansi>
    </pre>
  );
};

export default Log;
