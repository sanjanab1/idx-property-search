// leave empty for proxy 
const API_BASE = ''; 

export async function fetchProperties(params = {}) {
    try {
        const query = new URLSearchParams(params).toString(); 
        const url = `${API_BASE}/api/properties${query ? '?' + query : ''}`; 

        const response = await fetch(url); 

        if (!response.ok) 
            throw new Error(`HTTP $(response.status): $(response.statusText)`);

        return await response.json(); 
    } catch (error) {
        console.error('API Error:', error); 
        throw error; 
    }
}

export async function fetchOpenHouses(listingId) {
    try {
        const response = await fetch(`${API_BASE}/api/properties/${listingId}/openhouses`);

        if (!response.ok)
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        return await response.json(); 
    } catch (error) {
        console.error('API Error:', error)
        throw error; 
    }
}