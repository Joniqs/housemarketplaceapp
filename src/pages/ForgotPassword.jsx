/**
 * A component for resetting a user's password through Firebase authentication.
 *
 * @component
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

const ForgotPassword = () => {
  /**
   * The email entered by the user.
   *
   * @type {string}
   */
  const [email, setEmail] = useState('');
  /**
   * Updates the email state when the user types in the email input field.
   *
   * @param {object} e - The input event object.
   * @param {string} e.target.value - The current value of the input field.
   */
  const onChange = (e) => setEmail(e.target.value);

  /**
   * Sends a password reset email to the user's email address when the form is submitted.
   * Shows a success or error toast message depending on the result.
   *
   * @async
   * @param {object} e - The form submit event object.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent');
    } catch (error) {
      toast.error('Could not send reset email');
    }
  };

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />
          <Link className='forgotPasswordLink' to='/sign-in'>
            Sign In
          </Link>

          <div className='signInBar'>
            <div className='signInText'>Send Reset Link</div>
            <button className='signIn'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
