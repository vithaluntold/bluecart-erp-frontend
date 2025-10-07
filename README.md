# BlueCart ERP

# BlueCart ERP - Frontend

A modern, responsive ERP (Enterprise Resource Planning) system built with Next.js 15, TypeScript, and shadcn/ui components. This frontend provides a comprehensive interface for managing shipments, hubs, routes, users, and analytics.

## Features

- 📦 **Shipment Management**: Create, track, and manage shipments
- 🎯 **Manual Pricing**: Set custom pricing instead of weight-based automatic calculation
- 📊 **Dashboard**: Performance metrics, analytics, and recent shipments overview
- 🗄️ **PostgreSQL Integration**: Persistent data storage with full CRUD operations
- 🔍 **Real-time Tracking**: Track shipments with detailed event history
- 📱 **Responsive Design**: Built with Tailwind CSS and shadcn/ui components
- 🔧 **API Routes**: RESTful API endpoints for all operations
- ✅ **Comprehensive Testing**: API and database integration tests

## Tech Stack

- **Frontend**: Next.js 15.2.4, React, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with connection pooling
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: In-memory store with database persistence
- **Testing**: Node.js test suites

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vithaluntold/bluecart-erp.git
   cd bluecart-erp
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your PostgreSQL credentials:
   ```
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=shipment_erp
   ```

4. Set up the database:
   ```bash
   node setup-database.mjs
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Shipments
- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/[id]` - Get shipment by ID
- `PUT /api/shipments/[id]` - Update shipment
- `DELETE /api/shipments/[id]` - Delete shipment

### Sample API Usage

```bash
# Create a shipment
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "senderName": "John Doe",
    "senderAddress": "123 Main St",
    "receiverName": "Jane Smith", 
    "receiverAddress": "456 Oak Ave",
    "packageDetails": "Electronics",
    "weight": 2.5,
    "serviceType": "standard",
    "cost": 25.00
  }'
```

## Project Structure

```
├── app/
│   ├── api/shipments/          # API routes
│   ├── shipments/              # Shipment management pages
│   ├── dashboard/              # Dashboard components
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── dashboard/              # Dashboard-specific components
├── lib/
│   ├── shipment-store.ts       # Data management layer
│   ├── database.ts             # PostgreSQL connection
│   └── utils.ts                # Utility functions
├── database/
│   └── schema.sql              # Database schema
└── tests/                      # Test files
```

## Testing

Run API tests:
```bash
node test-api.js
```

Run database tests:
```bash
node test-postgres.js
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database: [PostgreSQL](https://postgresql.org/)