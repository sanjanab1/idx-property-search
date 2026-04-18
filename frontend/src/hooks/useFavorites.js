import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        const saved = localStorage.getItem('favoriteProperties');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const saveFavorites = (newFavorites) => {
        setFavorites(newFavorites);
        localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
    };
    
    const addFavorite = (propertyId) => {
        if (!favorites.includes(propertyId)) {
            saveFavorites([...favorites, propertyId]);
        }
    };
    
    const removeFavorite = (propertyId) => {
        saveFavorites(favorites.filter(id => id !== propertyId));
    };

    const clearFavorites = () => {
        saveFavorites([]);
    };
    
    const isFavorite = (propertyId) => {
        return favorites.includes(propertyId);
    };
    
    return {
        favorites,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite
    };
}