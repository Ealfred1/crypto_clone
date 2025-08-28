// ============================================
// STATE MANAGEMENT SYSTEM
// ============================================
class AppState {
    constructor() {
        this.state = {
            // Campaign data
            currentCampaign: null,
            currentContractAddress: null,
            
            // API data
            campaignData: null,
            transactionsData: null,
            escrowBalanceData: null,
            tokenData: null,
            
            // UI state
            isLoading: false,
            error: null,
            lastUpdated: null,
            
            // Settings
            pollingInterval: 10000, // 10 seconds
            autoRefresh: true
        };
        
        this.listeners = [];
        this.pollingInterval = null;
    }
    
    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    // Notify all listeners of state change
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
    
    // Update state and notify listeners
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
    
    // Get current state
    getState() {
        return this.state;
    }
    
    // Set loading state
    setLoading(loading) {
        this.setState({ isLoading: loading });
    }
    
    // Set error state
    setError(error) {
        this.setState({ error, isLoading: false });
    }
    
    // Clear error
    clearError() {
        this.setState({ error: null });
    }
    
    // Update last updated timestamp
    updateTimestamp() {
        this.setState({ lastUpdated: new Date().toISOString() });
    }
    
    // Start polling for updates
    startPolling() {
        if (this.pollingInterval) {
            this.stopPolling();
        }
        
        this.pollingInterval = setInterval(() => {
            if (this.state.autoRefresh && this.state.currentCampaign) {
                this.refreshData();
            }
        }, this.state.pollingInterval);
    }
    
    // Stop polling
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
    
    // Refresh all data
    async refreshData() {
        if (!this.state.currentContractAddress) return;
        
        try {
            this.setLoading(true);
            this.clearError();
            
            // Fetch campaign data
            await this.fetchCampaignData();
            
            // Fetch transactions
            await this.fetchTransactionsData();
            
            // Fetch escrow balance
            await this.fetchEscrowBalanceData();
            
            this.updateTimestamp();
            
        } catch (error) {
            this.setError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    // Fetch campaign data
    async fetchCampaignData() {
        try {
            const { fetchCampaignDetail } = await import('./api.js');
            console.log('Fetching campaign data for:', this.state.currentContractAddress);
            const data = await fetchCampaignDetail(this.state.currentContractAddress);
            
            if (data.success) {
                this.setState({ 
                    campaignData: data,
                    currentCampaign: data.campaign
                });
                console.log('Campaign data loaded successfully:', data.campaign.name);
            } else {
                throw new Error(data.error || 'Failed to fetch campaign data');
            }
        } catch (error) {
            console.error('Campaign data fetch failed:', error);
            throw new Error(`Campaign data fetch failed: ${error.message}`);
        }
    }
    
    // Fetch transactions data
    async fetchTransactionsData() {
        try {
            if (!this.state.currentCampaign?.wallet_address) {
                console.log('No wallet address available for transactions');
                return;
            }
            
            const { fetchEscrowTransactions } = await import('./api.js');
            console.log('Fetching transactions for wallet:', this.state.currentCampaign.wallet_address);
            const data = await fetchEscrowTransactions(this.state.currentCampaign.wallet_address);
            
            this.setState({ transactionsData: data });
            console.log('Transactions loaded:', data.transactionCount, 'transactions');
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            // Don't throw here, just log the error
        }
    }
    
    // Fetch escrow balance data
    async fetchEscrowBalanceData() {
        try {
            if (!this.state.currentCampaign?.wallet_address) {
                console.log('No wallet address available for balance');
                return;
            }
            
            const { fetchEscrowBalance } = await import('./api.js');
            console.log('Fetching escrow balance for wallet:', this.state.currentCampaign.wallet_address);
            const data = await fetchEscrowBalance(this.state.currentCampaign.wallet_address);
            
            if (data.success) {
                this.setState({ escrowBalanceData: data });
                
                // Update campaign balance if we have current campaign
                if (this.state.currentCampaign) {
                    const updatedCampaign = {
                        ...this.state.currentCampaign,
                        current_balance: data.data.balanceUSD
                    };
                    this.setState({ currentCampaign: updatedCampaign });
                }
                console.log('Escrow balance updated:', data.data.balanceSOL, 'SOL');
            }
        } catch (error) {
            console.error('Failed to fetch escrow balance:', error);
            // Don't throw here, just log the error
        }
    }
    
    // Fetch token data
    async fetchTokenData(contractAddress) {
        try {
            const { fetchTokenInfo } = await import('./api.js');
            const data = await fetchTokenInfo(contractAddress);
            
            this.setState({ tokenData: data });
        } catch (error) {
            console.error('Failed to fetch token data:', error);
        }
    }
    
    // Initialize with contract address
    async initialize(contractAddress) {
        this.setState({ 
            currentContractAddress: contractAddress,
            isLoading: true,
            error: null
        });
        
        try {
            await this.refreshData();
            this.startPolling();
        } catch (error) {
            this.setError(error.message);
        }
    }
    
    // Cleanup
    cleanup() {
        this.stopPolling();
        this.setState({
            currentCampaign: null,
            currentContractAddress: null,
            campaignData: null,
            transactionsData: null,
            escrowBalanceData: null,
            tokenData: null,
            isLoading: false,
            error: null,
            lastUpdated: null
        });
    }
}

// Create and export singleton instance
export const appState = new AppState();

// Export the class for testing if needed
export { AppState };
