import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

/**
 * Component that renders a Google OAuth button for authentication.
 * @component
 */
const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handler function for the Google OAuth button click event.
   * @async
   * @function
   * @throws {Error} Could not authorize with Google.
   * @returns {Promise<void>}
   */
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exist create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp,
        });
      }

      toast.success('Log In with Google Successfull');
      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google');
      throw new Error(error);
    }
  };

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt='google' />
      </button>
    </div>
  );
};

export default OAuth;
