/**
 * Renders a detailed view of a property listing, including a photo carousel, map with marker, and listing details.
 *
 * @component
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import WhatsAppShare from '../components/WhatsAppShare';

const Listing = () => {
  /**
   * The listing data to be displayed, retrieved from the Firestore database.
   * @type {Object}
   * @property {string} name - The name of the listing.
   * @property {string} location - The location of the listing.
   * @property {string} type - The type of the listing, either "rent" or "sale".
   * @property {number} bedrooms - The number of bedrooms in the listing.
   * @property {number} bathrooms - The number of bathrooms in the listing.
   * @property {boolean} parking - Whether or not the listing includes a parking spot.
   * @property {boolean} furnished - Whether or not the listing is furnished.
   * @property {number} regularPrice - The regular price of the listing.
   * @property {number} discountedPrice - The discounted price of the listing, if applicable.
   * @property {string[]} imgUrls - An array of URLs for the listing's photos.
   * @property {Object} geolocation - An object containing the latitude and longitude of the listing's location.
   * @property {number} geolocation.lat - The latitude of the listing's location.
   * @property {number} geolocation.lng - The longitude of the listing's location.
   * @property {string} userRef - The ID of the user who created the listing.
   */
  const [listing, setListing] = useState(null);
  /**
   * Whether or not the listing is still being fetched from the database.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);
  /**
   * Whether or not the share link has been copied to the clipboard.
   * @type {?boolean}
   */
  const [shareLinkCopied, setShareLinkCopied] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  /**
   * Fetches the listing data from the Firestore database and updates the `listing` and `loading` states accordingly.
   *
   * @async
   */
  useEffect(() => {
    /**
     * Fetches the listing data from the Firestore database.
     *
     * @async
     */
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  /**
   * Renders a loading spinner if the listing is still being fetched from the database, otherwise renders the listing details.
   *
   * @returns {JSX.Element} The component to be rendered.
   */
  if (loading) {
    return <Spinner />;
  }

  /**
   * Renders the listing details.
   *
   * @returns {JSX.Element} The component to be rendered.
   */
  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        a11y={true}
        navigation={true}
      >
        {listing.imgUrls.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              style={{ width: '100%', height: '' }}
              src={image}
              alt='{listing.title}'
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt='' />
      </div>

      <div className='shareWhatsApp'>
        <WhatsAppShare
          url={`/category/${params.categoryName}/${params.listingId}`}
          title={'Check out this rent/sale offer !'}
        />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - £
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
