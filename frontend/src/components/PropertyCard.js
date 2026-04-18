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

function PropertyCard({ property, isFavorite, addFavorite, removeFavorite }) {
    const photos = safeParsePhotos(property.L_Photos);
    const coverPhoto = photos[0] || null;
    const listingId = property.L_ListingID || property.ListingId || property.id;
    const navigate = useNavigate();
    const favorite = listingId && isFavorite ? isFavorite(listingId) : false;

    const handleClick = () => {
        if (!listingId) {
            return;
        }
        navigate(`/property/${listingId}`);
    };

    const handleFavoriteClick = (event) => {
        event.stopPropagation();

        if (!listingId) {
            return;
        }

        if (favorite) {
            removeFavorite(listingId);
        } else {
            addFavorite(listingId);
        }
    };

    return (
        <div className="property-card" onClick={handleClick}>
            {listingId && isFavorite && addFavorite && removeFavorite && (
                <button
                    type="button"
                    className={`favorite-btn ${favorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label={favorite ? 'Unpin property' : 'Pin property'}
                    title={favorite ? 'Unpin property' : 'Pin property'}
                >
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M12.0004 15L12.0004 22M8.00043 7.30813V9.43875C8.00043 9.64677 8.00043 9.75078 7.98001 9.85026C7.9619 9.93852 7.93194 10.0239 7.89095 10.1042C7.84474 10.1946 7.77977 10.2758 7.64982 10.4383L6.08004 12.4005C5.4143 13.2327 5.08143 13.6487 5.08106 13.9989C5.08073 14.3035 5.21919 14.5916 5.4572 14.7815C5.73088 15 6.26373 15 7.32943 15H16.6714C17.7371 15 18.27 15 18.5437 14.7815C18.7817 14.5916 18.9201 14.3035 18.9198 13.9989C18.9194 13.6487 18.5866 13.2327 17.9208 12.4005L16.351 10.4383C16.2211 10.2758 16.1561 10.1946 16.1099 10.1042C16.0689 10.0239 16.039 9.93852 16.0208 9.85026C16.0004 9.75078 16.0004 9.64677 16.0004 9.43875V7.30813C16.0004 7.19301 16.0004 7.13544 16.0069 7.07868C16.0127 7.02825 16.0223 6.97833 16.0357 6.92937C16.0507 6.87424 16.0721 6.8208 16.1149 6.71391L17.1227 4.19423C17.4168 3.45914 17.5638 3.09159 17.5025 2.79655C17.4489 2.53853 17.2956 2.31211 17.0759 2.1665C16.8247 2 16.4289 2 15.6372 2H8.36368C7.57197 2 7.17611 2 6.92494 2.1665C6.70529 2.31211 6.55199 2.53853 6.49838 2.79655C6.43707 3.09159 6.58408 3.45914 6.87812 4.19423L7.88599 6.71391C7.92875 6.8208 7.95013 6.87424 7.96517 6.92937C7.97853 6.97833 7.98814 7.02825 7.99392 7.07868C8.00043 7.13544 8.00043 7.19301 8.00043 7.30813Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            )}

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
    ,
    isFavorite: PropTypes.func,
    addFavorite: PropTypes.func,
    removeFavorite: PropTypes.func
};
export default PropertyCard;
