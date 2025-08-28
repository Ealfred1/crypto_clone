import { getContractAddressFromURL, updateCurrentTime } from './utils.js';
import { renderCampaignHeader, renderProgress, renderContributions, renderCampaignStats, renderEscrowWallet } from './render.js';
import { initTheme, toggleTheme } from './theme.js';
import { appState } from './state.js';

// ============================================
// GLOBAL STATE MANAGEMENT
// ============================================
let currentSOLPrice = 180; // Default SOL price, will be updated from health check

// ============================================
// MAIN FUNCTIONS
// ============================================
async function loadCampaignData() {
    try {
        console.log('🚀 Starting campaign data load...');
        
        // Test basic API connection first
        try {
            const response = await fetch('https://2ebb6db71568.ngrok-free.app/');
            const data = await response.text();
            console.log('✅ Basic API connection successful:', data);
        } catch (error) {
            console.warn('⚠️ Basic API connection failed:', error.message);
        }
        
        let contractAddress = getContractAddressFromURL();
        
        // If no contract address in URL, try to get one from health check
        if (!contractAddress) {
            console.log('No contract address found in URL, checking health check for available campaigns...');
            
            try {
                const healthResponse = await fetch('https://2ebb6db71568.ngrok-free.app/api/health');
                const healthData = await healthResponse.json();
                
                if (healthData.campaign_status && healthData.campaign_status.campaigns.length > 0) {
                    // Use the first available campaign's wallet address as contract address
                    const campaign = healthData.campaign_status.campaigns[0];
                    contractAddress = campaign.wallet_address;
                    console.log('Found campaign from health check:', campaign.campaign_id);
                } else {
                    // Fallback to default
                    contractAddress = 'FuXL5ZYZc6YBGkRxWQ98k1f64QSGWXtLwNN2Dj5f3XYf';
                    console.log('No campaigns in health check, using default wallet address');
                }
            } catch (error) {
                console.warn('Health check failed, using default wallet address:', error.message);
                contractAddress = 'FuXL5ZYZc6YBGkRxWQ98k1f64QSGWXtLwNN2Dj5f3XYf';
            }
            
            // Update the URL to show the contract address
            window.location.hash = `/coin/${contractAddress}`;
        }

        console.log('Loading campaign data for contract:', contractAddress);

        // Initialize state with contract address
        await appState.initialize(contractAddress);
        
        // Subscribe to state changes
        appState.subscribe(handleStateChange);
        
        // Show main content, hide loading
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');

    } catch (error) {
        console.error('Error loading campaign data:', error);
        document.getElementById('loadingState').innerHTML = `
            <div class="text-center">
                <div class="text-red-600 dark:text-gray-400 text-lg mb-4">Error loading campaign</div>
                <p class="text-gray-600 dark:text-gray-400">${error.message}</p>
                <button onclick="retryLoad()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Retry
                </button>
            </div>
        `;
    }
}

// Handle state changes from the state management system
function handleStateChange(state) {
    if (state.error) {
        showError(state.error);
        return;
    }
    
    if (state.isLoading) {
        showLoading();
        return;
    }
    
    if (state.currentCampaign && state.transactionsData) {
        // Render all components with fresh data
        renderCampaignHeader(state.currentCampaign);
        renderProgress(state.currentCampaign, currentSOLPrice);
        renderContributions(state.transactionsData);
        renderCampaignStats(state.currentCampaign, state.transactionsData, currentSOLPrice);
        renderEscrowWallet(state.currentCampaign);
        
        // Update last updated timestamp if available
        if (state.lastUpdated) {
            updateLastUpdatedDisplay(state.lastUpdated);
        }
    }
}

function showError(errorMessage) {
    document.getElementById('loadingState').innerHTML = `
        <div class="text-center">
            <div class="text-red-600 dark:text-red-400 text-lg mb-4">Error</div>
            <p class="text-gray-600 dark:text-gray-400">${errorMessage}</p>
            <button onclick="retryLoad()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Retry
            </button>
        </div>
    `;
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

function showLoading() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

function updateLastUpdatedDisplay(timestamp) {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const date = new Date(timestamp);
        lastUpdatedElement.textContent = `Last updated: ${date.toLocaleTimeString()}`;
    }
}

async function retryLoad() {
    try {
        const contractAddress = getContractAddressFromURL();
        if (contractAddress) {
            await appState.initialize(contractAddress);
        }
    } catch (error) {
        showError(error.message);
    }
}

async function refreshContributions() {
    if (appState.getState().currentCampaign) {
        await appState.refreshData();
    }
}

async function updateSOLPrice() {
    try {
        const { fetchHealthCheck } = await import('./api.js');
        const healthData = await fetchHealthCheck();
        if (healthData.sol_price) {
            currentSOLPrice = healthData.sol_price;
            console.log('SOL price updated:', currentSOLPrice);
        }
    } catch (error) {
        console.warn('Failed to update SOL price from health check, using default:', error.message);
        // Keep using the default price if health check fails
        currentSOLPrice = 180;
    }
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    // Initialize theme
    initTheme();

    // Update current time immediately and then every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Update SOL price from health check
    await updateSOLPrice();
    setInterval(updateSOLPrice, 60000); // Update every minute

    // Load campaign data
    await loadCampaignData();
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', init);

// Theme toggle event listeners
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
});

// Clean up state when page is unloaded
window.addEventListener('beforeunload', () => {
    appState.cleanup();
});

// Handle visibility change to pause/resume polling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        appState.stopPolling();
    } else if (appState.getState().currentCampaign) {
        appState.startPolling();
    }
});

// Expose functions to global scope for onclick attributes in HTML
window.copyToClipboard = (elementId) => {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.value;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        setTimeout(() => {
            element.textContent = originalText;
        }, 1000);
    });
};

window.openExplorer = () => {
    const escrowAddress = document.getElementById('escrowAddress').textContent;
    window.open(`https://solscan.io/account/${escrowAddress}`, '_blank');
};

window.refreshContributions = refreshContributions;
window.retryLoad = retryLoad;
