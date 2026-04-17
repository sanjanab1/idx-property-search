import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';
import './PropertyDetailPage.css';

function getFirstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }
    return null;
}

function parsePhotos(rawPhotos) {
    if (!rawPhotos) {
        return [];
    }

    if (Array.isArray(rawPhotos)) {
        return rawPhotos;
    }

    if (typeof rawPhotos !== 'string') {
        return [];
    }

    try {
        const parsed = JSON.parse(rawPhotos);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function PropertyDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPropertyData();
    }, [id]);
    
    async function loadPropertyData() {
        try {
            setLoading(true);
            setError(null);
            const [propertyData, openHousesData] = await Promise.all([
            fetchPropertyDetail(id),
            fetchOpenHouses(id)
            ]);
            setProperty(propertyData);
            setOpenHouses(openHousesData.openhouses || []);
        } catch (err) {
            setError(err.message || 'Failed to load property details');
        } finally {
            setLoading(false);
        }
    }
    
    if (loading) {
        return <div className="loading">Loading property details...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error">{error}</div>
                <button onClick={() => navigate('/')} className="btn-back">
                    Back to Listings
                </button>
            </div>
        );
    }

    if (!property) {
        return null;
    }

    const price = getFirstDefined(property.ListPrice, property.L_SystemPrice);
    const address = getFirstDefined(property.UnparsedAddress, property.L_Address);
    const city = getFirstDefined(property.City, property.L_City);
    const state = getFirstDefined(property.StateOrProvince, property.L_State);
    const postalCode = getFirstDefined(property.PostalCode, property.L_Zip);
    const photos = parsePhotos(property.L_Photos);
    const primaryImage = getFirstDefined(property.Media, photos[0]);
    const bedrooms = getFirstDefined(property.BedroomsTotal, property.L_Keyword2);
    const bathrooms = getFirstDefined(property.BathroomsTotalInteger, property.LM_Dec_3);
    const livingArea = getFirstDefined(property.LivingArea, property.LM_Int2_3);
    const yearBuilt = getFirstDefined(property.YearBuilt, property.L_YearBuilt);
    const propertyType = getFirstDefined(property.PropertyType, property.L_Type_);
    const propertySubtype = getFirstDefined(property.PropertySubType, property.L_Type);
    const lotSize = getFirstDefined(property.LotSizeAcres, property.LotSizeArea);
    const parkingTotal = getFirstDefined(property.ParkingTotal, property.L_ParkingSpaces);
    const description = getFirstDefined(property.PublicRemarks, property.L_Remarks);
    const listingId = getFirstDefined(property.ListingId, property.L_ListingID);
    const status = getFirstDefined(property.StandardStatus, property.L_Status);
    const listedDate = getFirstDefined(property.ListingContractDate, property.L_ListingDate);

    return (
        <div className="property-detail-page">
            <button onClick={() => navigate('/')} className="btn-back">
                ← Back to Listings
            </button>

            <div className="property-header">
                <h1>{price ? `$${Number(price).toLocaleString()}` : 'Price unavailable'}</h1>
                <p className="property-address">{address || 'Address unavailable'}</p>
                <p className="property-location">
                    {[city, state].filter(Boolean).join(', ')} {postalCode || ''}
                </p>
            </div>

            <div className="property-image-main">
                {primaryImage ? (
                    <img src={primaryImage} alt={address || 'Property'} />
                ) : (
                    <div className="no-image">No image available</div>
                )}
            </div>

            <div className="property-content">
                <div className="property-main">
                    <div className="property-stats">
                        <div className="stat stat-bedrooms">
                            <div className="stat-value">{bedrooms ?? '-'}</div>
                            <div className="stat-label">Bedrooms</div>
                        </div>
                        <div className="stat stat-bathrooms">
                            <div className="stat-value">{bathrooms ?? '-'}</div>
                            <div className="stat-label">Bathrooms</div>
                        </div>
                        {livingArea && (
                            <div className="stat stat-area">
                                <div className="stat-value">{Number(livingArea).toLocaleString()}</div>
                                <div className="stat-label">Sq Ft</div>
                            </div>
                        )}
                        {yearBuilt && (
                            <div className="stat stat-year-built">
                                <div className="stat-value">{yearBuilt}</div>
                                <div className="stat-label">Year Built</div>
                            </div>
                        )}
                    </div>

                    <div className="property-section">
                        <h2>Property Details</h2>
                        <div className="detail-grid">
                            {propertyType && (
                                <div className="detail-item">
                                    <span className="detail-label">Property Type:</span>
                                    <span className="detail-value">{propertyType}</span>
                                </div>
                            )}
                            {propertySubtype && (
                                <div className="detail-item">
                                    <span className="detail-label">Property Subtype:</span>
                                    <span className="detail-value">{propertySubtype}</span>
                                </div>
                            )}
                            {lotSize && (
                                <div className="detail-item">
                                    <span className="detail-label">Lot Size:</span>
                                    <span className="detail-value">{lotSize} acres</span>
                                </div>
                            )}
                            {parkingTotal && (
                                <div className="detail-item">
                                    <span className="detail-label">Parking Spaces:</span>
                                    <span className="detail-value">{parkingTotal}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {description && (
                        <div className="property-section">
                            <h2>Description</h2>
                            <p className="property-description">{description}</p>
                        </div>
                    )}
                </div>
            
                <div className="property-sidebar">
                    <div className="open-houses-section">
                        <h3>Open Houses</h3>
                        {openHouses.length > 0 ? (
                            <div className="open-houses-list">
                                {openHouses.map((oh, index) => (
                                    <div key={index} className="open-house-item">
                                        <div className="oh-date">
                                            {new Date(oh.OpenHouseDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                            <div className="oh-time">
                                            {oh.OH_StartTime || oh.OpenHouseStartTime} - {oh.OH_EndTime || oh.OpenHouseEndTime}
                                        </div>
                                        {(oh.OpenHouseRemarks || oh.OH_Remarks) && (
                                            <div className="oh-remarks">{oh.OpenHouseRemarks || oh.OH_Remarks}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-open-houses">No open houses scheduled</p>
                        )}
                    </div>
            
                    <div className="listing-info-section">
                        <h3>Listing Information</h3>
                        <div className="listing-info">
                            {listingId && (
                                <div className="info-item">
                                    <span className="info-label">MLS #:</span>
                                    <span className="info-value">{listingId}</span>
                                </div>
                            )}
                            {status && (
                                <div className="info-item">
                                    <span className="info-label">Status:</span>
                                    <span className="info-value">{status}</span>
                                </div>
                            )}
                            {listedDate && (
                                <div className="info-item">
                                    <span className="info-label">Listed:</span>
                                    <span className="info-value">
                                        {new Date(listedDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyDetailPage;