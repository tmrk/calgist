import { useEffect, useState } from 'react';

const isFacebookInAppBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /FBAN|FBAV/.test(userAgent);
};

const useFacebookBrowser = () => {
  const [isFacebook, setIsFacebook] = useState(false);

  useEffect(() => {
    setIsFacebook(isFacebookInAppBrowser());
  }, []);

  return isFacebook;
};

export default useFacebookBrowser;
