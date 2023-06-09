/**
  A React component that allows users to sign in with their email and password.
  If the sign in is successful, the user is redirected to the home page.
  @component
  @example
  return (
  <SignIn />
  )
*/
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { toast } from 'react-toastify';

const SignIn = () => {
  // States
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  /**
  A function that updates the formData state when the user types in the email or password input.
  @param {Event} e - The input change event.
  */
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  /**
  A function that handles the submission of the sign in form.
  @param {Event} e - The form submission event.
  */
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      /**
       * Firebase auth API call to authenticate user account
       */
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      //Logged In message
      if (userCredential.user) {
        toast.success('Logged In Successfully!');
        navigate('/');
      }
    } catch (error) {
      //Error message
      toast.error('Wrong User Credentials');
    }
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back !</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />
          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link>

          <div className='signInBar'>
            <p className='signInText'>Sign In</p>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
        <OAuth />
        <Link to='/sign-up' className='registerLink'>
          Sign Up Instead
        </Link>
      </div>
    </>
  );
};

export default SignIn;
