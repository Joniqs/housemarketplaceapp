/**
A component that serves as a private route for authenticated users.
If the user is authenticated, the component renders its child components,
otherwise it redirects the user to the sign-in page.
@return {JSX.Element} A JSX element that renders the child components if the user is authenticated,
and redirects the user to the sign-in page otherwise.
*/
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';
const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
