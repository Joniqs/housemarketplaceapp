/**
 * The Explore component displays a page for exploring different categories of places.
 * It includes a slider and two categories: "Places for rent" and "Places for sell".
 */
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

const Explore = () => {
  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'>Explore</p>
      </header>

      <main>
        <Slider />
        <p className='exploreCategoryHeading'>Categories</p>
        <div className='exploreCategories'>
          <Link to='/category/rent'>
            <img
              src={rentCategoryImage}
              alt='rent'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Places for rent</p>
          </Link>
          <Link to='/category/sale'>
            <img
              src={sellCategoryImage}
              alt='sale'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Places for sell</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Explore;
