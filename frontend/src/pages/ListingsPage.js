import React, { useState, useEffect } from 'react'; 
import { fetchProperties } from '../api/client'; 
import { useNavigate } from 'react-router-dom';
import './ListingsPage.css'; 
// integratng filtering into listings page
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';

function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    useEffect(() => {
        loadProperties();
    }, [filters, currentPage]);
    
    async function loadProperties() {
        try {
            setLoading(true);
            setError(null);

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

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to page 1 when filters change
    }; 
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0); // Scroll to top
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
            <PropertyFilters onSearch={handleSearch} />

            {!loading && !error && (
                <p className="results-summary">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-
                    {Math.min(currentPage * itemsPerPage, total)} of {total.toLocaleString()} properties
                </p>
            )}

            {properties.length === 0 ? (
                <div className="no-results">
                    No properties found matching your criteria. Try adjusting your filters.
                </div>
            ) : (
                <div className="property-grid">
                    {properties.map(property => (
                        <PropertyCard key={property.L_ListingID || property.id} property={property} />
                    ))}
                </div>
            )}

            {!loading && !error && properties.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

function PropertyCard({ property }) {
    const photos = safeParsePhotos(property.L_Photos);
    const coverPhoto = photos[0] || null;
    const listingId = property.L_ListingID || property.ListingId || property.id;

    const navigate = useNavigate();

    const handleClick = () => {
        if (!listingId) {
            return;
        }
        navigate(`/property/${listingId}`);
    };

    return (
        <div className="property-card"onClick={handleClick}>
            <div className="property-image">
                {coverPhoto ? (
                    <img src={coverPhoto} alt={property.L_Address || 'Property'} />
                ) : (
                    <div className="no-image">No image available</div>
                )}
                </div>
                
                <div className="property-info">
                    <div className="price">${Number(property.L_SystemPrice || 0).toLocaleString()}</div>
                    <div className="address">{property.L_Address || 'Address unavailable'}</div>
                    <div className="city">{property.L_City || ''}, {property.L_State || ''}</div>
                    
                    <div className="property-details">
                    <span>{property.L_Keyword2 ?? 0} beds</span>
                    <span>•</span>
                    <span>{property.LM_Dec_3 ?? 0} baths</span>
                    {property.LM_Int2_3 && (
                        <>
                            <span>•</span>
                            <span>{Number(property.LM_Int2_3).toLocaleString()} sqft</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function safeParsePhotos(rawPhotos) {
    if (!rawPhotos || typeof rawPhotos !== 'string') {
        return [];
    }

    try {
        const parsed = JSON.parse(rawPhotos);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default ListingsPage;