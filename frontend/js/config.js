// ============================================
// CONFIGURATION - Backend API endpoints
// ============================================
export const API_CONFIG = {
    // Backend API endpoints - Remote ngrok server
    BASE_URL: 'https://2ebb6db71568.ngrok-free.app',
    CAMPAIGN_DETAIL: '/api/campaign-detail',
    ESCROW_TRANSACTIONS: '/api/escrow-transactions',
    ESCROW_BALANCE: '/api/escrow-balance',
    TOKEN_INFO: '/api/token',
    CAMPAIGN_QR: '/api/campaigns',
    HEALTH_CHECK: '/api/health',
    DEXSCREENER_API: 'https://api.dexscreener.com/latest/dex/pairs/solana'
};

// ============================================
// API HELPER FUNCTIONS
// ============================================
export const buildApiUrl = (endpoint, params = {}) => {
    try {
        const url = new URL(API_CONFIG.BASE_URL + endpoint);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });
        console.log('🔗 Built API URL:', url.toString());
        return url.toString();
    } catch (error) {
        console.error('❌ Error building API URL:', error);
        throw error;
    }
};

export const handleApiError = (error, context = 'API call') => {
    console.error(`❌ ${context} failed:`, error);
    if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
    }
    throw error;
};

// Debug function to test API connectivity
export const testApiConnection = async () => {
    try {
        console.log('🧪 Testing API connection...');
        const testUrl = buildApiUrl('/');
        console.log('Test URL:', testUrl);
        
        const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        const data = await response.text();
        console.log('Response data:', data);
        
        return { success: true, data };
    } catch (error) {
        console.error('❌ API connection test failed:', error);
        return { success: false, error: error.message };
    }
};
