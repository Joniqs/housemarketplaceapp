/**
Spinner Component
A loading spinner component that is used to indicate that data is being loaded or processed.
@returns {JSX.Element} A loading spinner element
*/
const Spinner = () => {
  return (
    <div className='loadingSpinnerContainer'>
      <div className='loadingSpinner'></div>
    </div>
  );
};

export default Spinner;
