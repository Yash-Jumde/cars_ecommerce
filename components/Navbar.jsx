import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineShopping, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'
import { FiFilter } from 'react-icons/fi'

import { Cart } from './'
import { useStateContext } from '../context/StateContext'

const Navbar = () => {
    const { 
        showCart, 
        setShowCart, 
        totalQuantities, 
        handleSearch, 
        handleCategoryChange, 
        categories, 
        searchTerm, 
        selectedCategory 
    } = useStateContext();
    
    const [searchValue, setSearchValue] = useState(searchTerm);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    
    // Check if we're on the home page
    const isHomePage = router.pathname === '/';

    // Update search input when searchTerm changes from context
    useEffect(() => {
        setSearchValue(searchTerm);
    }, [searchTerm]);

    // Handle click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchValue);
        
        // Navigate to home page if we're not already there
        if (!isHomePage) {
            router.push('/');
        }
    };

    // Clear search input and update context
    const clearSearch = () => {
        setSearchValue('');
        handleSearch('');
    };

    // Toggle category dropdown
    const toggleCategoryDropdown = () => {
        setShowCategoryDropdown(!showCategoryDropdown);
    };

    // Select category and close dropdown
    const selectCategory = (category) => {
        handleCategoryChange(category);
        setShowCategoryDropdown(false);
        
        // Navigate to home page if we're not already there
        if (!isHomePage) {
            router.push('/');
        }
    };

    // Clear all filters
    const clearFilters = () => {
        handleCategoryChange('');
    };

    return (
        <div className='navbar-container'>
            <p className='logo'>
                <Link href='/'>Miniature Cars</Link>
            </p>

            {isHomePage && (
                <div className='search-filter-container'>
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className='search-container'>
                        <input
                            type='text'
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder='Search cars...'
                            className='search-input'
                        />
                        {searchValue && (
                            <button 
                                type='button' 
                                className='clear-search-button'
                                onClick={clearSearch}
                            >
                                <AiOutlineClose />
                            </button>
                        )}
                        <button type='submit' className='search-button'>
                            <AiOutlineSearch />
                        </button>
                    </form>

                    {/* Category Filter */}
                    <div className='filter-container' ref={dropdownRef}>
                        <button 
                            type='button' 
                            className='filter-button'
                            onClick={toggleCategoryDropdown}
                        >
                            <FiFilter />
                            <span>{selectedCategory || 'All Categories'}</span>
                        </button>
                        
                        {showCategoryDropdown && (
                            <div className='category-dropdown'>
                                <div 
                                    className={`category-item ${!selectedCategory ? 'active' : ''}`}
                                    onClick={() => selectCategory('')}
                                >
                                    All Categories
                                </div>
                                
                                {categories.map((category) => (
                                    <div 
                                        key={category}
                                        className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => selectCategory(category)}
                                    >
                                        {category}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear Category Filter Button - Only show when category filter is active */}
                    {selectedCategory && (
                        <button 
                            className='clear-filters-button'
                            onClick={clearFilters}
                        >
                            Clear Category Filter
                        </button>
                    )}
                </div>
            )}

            <button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
                <AiOutlineShopping />
                <span className='cart-item-qty'>{totalQuantities}</span>
            </button>

            {showCart && <Cart />}
        </div>
    )
}

export default Navbar