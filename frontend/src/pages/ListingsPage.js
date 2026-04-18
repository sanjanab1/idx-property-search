import React, { useState, useEffect } from 'react';
import { fetchProperties, fetchPropertyDetail } from '../api/client';
import './ListingsPage.css';
// integrating filtering into listings page
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';
import { useFavorites } from '../hooks/useFavorites';

function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [activeTab, setActiveTab] = useState('listings');
    const { favorites, isFavorite, addFavorite, removeFavorite, clearFavorites } = useFavorites();

    useEffect(() => {
        async function loadProperties() {
            try {
                setLoading(true);
                setError(null);

                if (activeTab === 'favorites') {
                    const favoriteIds = favorites.map(String);
                    const favoriteResults = await Promise.all(
                        favoriteIds.map(async (listingId) => {
                            try {
                                return await fetchPropertyDetail(listingId);
                            } catch {
                                return null;
                            }
                        })
                    );

                    const favoriteProperties = favoriteResults.filter(Boolean);
                    setProperties(favoriteProperties);
                    setTotal(favoriteProperties.length);
                    return;
                }

                const offset = (currentPage - 1) * itemsPerPage;
                const params = { ...filters, limit: itemsPerPage, offset };
                const data = await fetchProperties(params);

                setProperties(data.results);
                setTotal(data.total);
            } catch (err) {
                setError('Failed to load properties. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadProperties();
    }, [activeTab, filters, currentPage, itemsPerPage, favorites]);

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleTabChange = (nextTab) => {
        setActiveTab(nextTab);
        setCurrentPage(1);
        setError(null);
        if (nextTab === 'favorites') {
            setFilters({});
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    const totalPages = Math.ceil(total / itemsPerPage);

    if (loading) {
        return <div className="loading">Loading properties...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="listings-page">
            <h1>Property Listings</h1>

            <div className="listings-tabs" role="tablist" aria-label="Property views">
                <button
                    type="button"
                    className={`listings-tab ${activeTab === 'listings' ? 'active' : ''}`}
                    onClick={() => handleTabChange('listings')}
                    role="tab"
                    aria-selected={activeTab === 'listings'}
                >
                    All Properties
                </button>
                <button
                    type="button"
                    className={`listings-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => handleTabChange('favorites')}
                    role="tab"
                    aria-selected={activeTab === 'favorites'}
                >
                    Favorited Houses
                </button>
            </div>

            {activeTab === 'favorites' && favorites.length > 0 && (
                <div className="favorites-actions">
                    <button type="button" className="btn-secondary favorites-clear-btn" onClick={clearFavorites}>
                        Remove All Favorites
                    </button>
                </div>
            )}

            {activeTab === 'listings' && <PropertyFilters onSearch={handleSearch} />}

            {!loading && !error && (
                <p className="results-summary">
                    {activeTab === 'favorites'
                        ? `${total.toLocaleString()} favorited ${total === 1 ? 'house' : 'houses'}`
                        : `Showing ${((currentPage - 1) * itemsPerPage) + 1}-
                    ${Math.min(currentPage * itemsPerPage, total)} of ${total.toLocaleString()} properties`
                    }
                </p>
            )}

            {properties.length === 0 ? (
                <div className="no-results">
                    {activeTab === 'favorites'
                        ? 'No favorited houses yet. Pin a property to see it here.'
                        : 'No properties found matching your criteria. Try adjusting your filters.'}
                </div>
            ) : (
                <div className="property-grid">
                    {properties.map(property => (
                        <PropertyCard
                            key={property.L_ListingID || property.id}
                            property={property}
                            isFavorite={isFavorite}
                            addFavorite={addFavorite}
                            removeFavorite={removeFavorite}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && properties.length > 0 && (
                activeTab === 'listings' && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )
            )}

        </div>
    );
}

export default ListingsPage;
