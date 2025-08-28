# DexVault Campaign System

A full-stack application for managing and monitoring Solana memecoin campaigns with real-time data from blockchain APIs.

## 🚀 Features

- **Real-time Campaign Monitoring**: Live updates from Solana blockchain
- **API Integration**: Full backend API with FastAPI
- **State Management**: Centralized state management for frontend
- **Responsive UI**: Modern, mobile-friendly interface
- **Real-time Updates**: Auto-refresh data every 10 seconds
- **Error Handling**: Comprehensive error handling and retry mechanisms

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Async database ORM
- **Solana RPC**: Direct blockchain integration
- **Redis**: Caching and session management
- **PostgreSQL**: Primary database
- **Remote Deployment**: Running on ngrok for external access

### Frontend (Vanilla JavaScript)
- **State Management**: Custom state management system
- **API Integration**: Real-time API consumption
- **Responsive Design**: Tailwind CSS framework
- **Real-time Updates**: Polling-based data refresh

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+ (for development)
- PostgreSQL database
- Redis server
- Solana RPC endpoint

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crypto_clone
```

### 2. Backend Setup (Remote)
The backend is already running remotely at:
- **API Base URL**: https://2ebb6db71568.ngrok-free.app
- **Health Check**: https://2ebb6db71568.ngrok-free.app/api/health
- **API Docs**: https://2ebb6db71568.ngrok-free.app/docs

### 3. Frontend Setup
```bash
cd frontend

# No build step required - vanilla JavaScript
# Just serve the files with a web server
```

## ⚙️ Configuration

### Frontend Configuration
The frontend automatically connects to the remote backend at `https://2ebb6db71568.ngrok-free.app`.

### Backend Environment Variables (for reference)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dexvault
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
WALLET=your_solana_wallet_address
REDIS_URL=redis://localhost:6379
```

## 🚀 Running the Application

### 1. Backend (Already Running)
✅ Backend is running remotely at: https://2ebb6db71568.ngrok-free.app

### 2. Start Frontend
```bash
cd frontend
python serve.py
```

The frontend will be available at:
- **Application**: http://localhost:3000

## 📚 API Endpoints

### Campaign Management
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaign-detail/{contract_address}` - Get campaign details
- `GET /api/campaigns/{campaign_id}/qr` - Generate QR code

### Transaction & Balance
- `GET /api/escrow-transactions/{wallet_address}` - Get escrow transactions
- `GET /api/escrow-balance?wallet={address}` - Get escrow balance

### Token Information
- `GET /api/token/{contract_address}` - Get token metadata
- `GET /api/health` - Health check with SOL price

## 🔄 State Management

The frontend uses a custom state management system that:

- **Centralizes Data**: All API data is stored in one place
- **Real-time Updates**: Automatically refreshes data every 10 seconds
- **Error Handling**: Graceful error handling with retry mechanisms
- **Performance**: Efficient updates without unnecessary re-renders

### State Structure
```javascript
{
  currentCampaign: CampaignData,
  transactionsData: TransactionData,
  escrowBalanceData: BalanceData,
  tokenData: TokenData,
  isLoading: boolean,
  error: string | null,
  lastUpdated: string
}
```

## 🎯 Usage

### 1. Access Campaign
Navigate to: `http://localhost:3000/#/coin/{contract_address}`

### 2. View Real-time Data
- Campaign progress updates automatically
- Transaction history refreshes every 10 seconds
- Balance updates in real-time
- SOL price updates every minute

### 3. Manual Refresh
Click the refresh button to manually update data

## 🧪 Testing

### Backend Testing
The backend is already running and accessible at:
- **Health Check**: https://2ebb6db71568.ngrok-free.app/api/health
- **API Documentation**: https://2ebb6db71568.ngrok-free.app/docs

### Frontend Testing
```bash
cd frontend
# Open browser and test functionality
# Check browser console for any errors
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if ngrok tunnel is still active
   - Verify the backend URL: https://2ebb6db71568.ngrok-free.app
   - Check backend health endpoint

2. **Frontend Not Loading**
   - Ensure frontend server is running on port 3000
   - Check browser console for errors
   - Verify API endpoints are accessible

3. **Data Not Updating**
   - Check backend health endpoint
   - Verify Solana RPC connection
   - Check database connectivity

### Debug Mode
Enable debug logging in the backend by setting log level to "debug" in the configuration.

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at https://2ebb6db71568.ngrok-free.app/docs
- Review the health check endpoint for system status

---

**Happy Campaigning! 🚀**
