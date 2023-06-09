/**

React functional component for user profile page
@function
@returns {JSX.Element} - Rendered component
*/
import { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

const Profile = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  /**
  Fetch user listings from Firestore
  @async
  @function
  @returns {void}
  */
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  /**
  Logs out the user and navigates to home page
  @function
  @returns {void}
  */
  const onLogout = () => {
    auth.signOut();
    toast.success('Logged Out Successfully!');
    navigate('/');
  };

  /**
  Handles form submission for changing user profile details
  @async
  @function
  @returns {void}
  */
  const onSubmit = async () => {
    try {
      const user = auth.currentUser;
      const newEmail = formData.email;
      if (user.displayName !== name || user.email !== newEmail) {
        // Update display name in Firebase
        await updateProfile(user, {
          displayName: name,
        });
        // Update email in Firebase
        await updateEmail(user, newEmail);
        // Update in Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name,
          email: newEmail,
        });

        toast.success('Changed details successfully!');
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  /**
  Handles form input change and updates form data state
  @function
  @param {Object} e - Event object
  @returns {void}
  */
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  /**
  Deletes a listing from Firestore
  @async
  @function
  @param {string} listingId - ID of the listing to delete
  @returns {void}
  */
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );

      setListings(updatedListings);
      toast.success('Successfully deleted listing');
    }
  };

  /**
  Navigates to listing edit page
  @function
  @param {string} listingId - ID of the listing to edit
  @returns {void}
  */
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  /**
   * Creates profile with jsx
   */
  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <div className='listingText'>
              <ul className='listingsList'>
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
