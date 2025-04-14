import React from 'react';

import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import { useStateContext } from '../context/StateContext';

const Home = ({ bannerData }) => {
  const { filteredProducts, loading, searchTerm, selectedCategory } = useStateContext();
  
  // Determine if filters are active
  const filtersActive = searchTerm || selectedCategory;

  return (
    <div>
      {/* Only show HeroBanner when no filters are active */}
      {!filtersActive && <HeroBanner heroBanner={bannerData.length && bannerData[0]} />}
      
      <div className="products-heading">
        <h2>
          {filtersActive 
            ? 'Search Results' 
            : 'Best Seller Products'}
        </h2>
        <p>
          {searchTerm && `Search: "${searchTerm}"`}
          {searchTerm && selectedCategory && ' | '}
          {selectedCategory && `Category: ${selectedCategory}`}
          {!filtersActive && 'Buy Now!'}
        </p>
      </div>

      <div className="products-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredProducts?.length ? (
          filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <div className="no-results">
            No products found matching your criteria
          </div>
        )}
      </div>

      {/* Only show FooterBanner when no filters are active */}
      {!filtersActive && <FooterBanner footerBanner={bannerData && bannerData[0]} />}
    </div>
  );
};

export const getServerSideProps = async () => {
  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { bannerData }
  }
}

export default Home;