import React, { useState, useEffect } from 'react'; 
import { fetchProperties } from '../api/client'; 
import './ListingsPage.css'; 
// integratng filtering into listings page
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';
import PropertyCard from '../components/PropertyCard'

function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    useEffect(() => {
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

        loadProperties();
    }, [filters, currentPage, itemsPerPage]);

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
            <header className="listings-hero">
                <div className="hero-content">
                    <h1>Property Listings</h1>
                    <p className="hero-subtitle">
                        Explore neighborhoods, compare homes, and fine-tune results with filters and sorting.
                    </p>
                </div>
            </header>

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
export default ListingsPage;
