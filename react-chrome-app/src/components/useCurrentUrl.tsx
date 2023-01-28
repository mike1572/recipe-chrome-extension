
import { useEffect, useState } from 'react';

const useCurrentUrl = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const getCurrentUrl = async () => {
      const currentUrl = await window.location.href;
      const urlParts = currentUrl.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      setUrl(lastPart);
    }
    getCurrentUrl();
  }, []);

  return url;
}

export default useCurrentUrl;