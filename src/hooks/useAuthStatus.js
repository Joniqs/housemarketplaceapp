import { useEffect, useState } from 'react';
/**

A custom React hook to check the user authentication status
@returns {{loggedIn: boolean, checkingStatus: boolean}} An object containing the user's authentication status and whether the authentication status is being checked or not
*/
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  });

  return { loggedIn, checkingStatus };
};
