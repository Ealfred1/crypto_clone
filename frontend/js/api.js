import { API_CONFIG, buildApiUrl, handleApiError } from './config.js';

// ============================================
// API FUNCTIONS (Real backend implementation)
// ============================================
export async function fetchCampaignDetail(contractAddress) {
    try {
        const url = buildApiUrl(`${API_CONFIG.CAMPAIGN_DETAIL}/${contractAddress}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error, 'fetchCampaignDetail');
        throw error;
    }
}

export async function fetchEscrowTransactions(escrowPublicKey) {
    try {
        const url = buildApiUrl(`${API_CONFIG.ESCROW_TRANSACTIONS}/${escrowPublicKey}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error, 'fetchEscrowTransactions');
        throw error;
    }
}

export async function fetchEscrowBalance(escrowPublicKey) {
    try {
        const url = buildApiUrl(API_CONFIG.ESCROW_BALANCE, { wallet: escrowPublicKey });
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error, 'fetchEscrowBalance');
        throw error;
    }
}

export async function fetchTokenInfo(contractAddress) {
    try {
        const url = buildApiUrl(`${API_CONFIG.TOKEN_INFO}/${contractAddress}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error, 'fetchTokenInfo');
        throw error;
    }
}

export async function fetchCampaignQR(campaignId, amount = null) {
    try {
        const params = {};
        if (amount !== null) {
            params.amount = amount;
        }
        
        const url = buildApiUrl(`${API_CONFIG.CAMPAIGN_QR}/${campaignId}/qr`, params);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error, 'fetchCampaignQR');
        throw error;
    }
}

export async function fetchHealthCheck() {
    try {
        const url = buildApiUrl(API_CONFIG.HEALTH_CHECK);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error, 'fetchHealthCheck');
        throw error;
    }
}

export async function fetchPairData(tokenAddress) {
    try {
        const url = buildApiUrl(API_CONFIG.DEXSCREENER_API, { token: tokenAddress });
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error, 'fetchPairData');
        throw error;
    }
}
