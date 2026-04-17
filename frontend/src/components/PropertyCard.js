import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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
        <div className="property-card" onClick={handleClick}>
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

PropertyCard.propTypes = {
    property: PropTypes.shape({
        L_ListingID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        ListingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        L_SystemPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        L_Address: PropTypes.string,
        L_City: PropTypes.string,
        L_State: PropTypes.string,
        L_Keyword2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        LM_Dec_3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        LM_Int2_3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        L_Photos: PropTypes.string
    }).isRequired
};
export default PropertyCard;
