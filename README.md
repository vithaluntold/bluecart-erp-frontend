# BlueCart ERP Frontend# BlueCart ERP



A modern, responsive ERP frontend built with Next.js 15, TypeScript, and shadcn/ui components for logistics management.# BlueCart ERP - Frontend



## FeaturesA modern, responsive ERP (Enterprise Resource Planning) system built with Next.js 15, TypeScript, and shadcn/ui components. This frontend provides a comprehensive interface for managing shipments, hubs, routes, users, and analytics.



- 📦 **Shipment Management**: Create, track, and manage shipments## Features

- 🏢 **Hub Management**: Manage distribution centers and hubs

- 🛣️ **Route Planning**: Create and optimize delivery routes- 📦 **Shipment Management**: Create, track, and manage shipments

- 👥 **User Management**: Handle user roles and permissions- 🎯 **Manual Pricing**: Set custom pricing instead of weight-based automatic calculation

- 📊 **Analytics Dashboard**: Real-time insights and metrics- 📊 **Dashboard**: Performance metrics, analytics, and recent shipments overview

- ⚙️ **Settings**: User profile and system configuration- 🗄️ **PostgreSQL Integration**: Persistent data storage with full CRUD operations

- 🎨 **Modern UI**: Beautiful, responsive design with dark/light themes- 🔍 **Real-time Tracking**: Track shipments with detailed event history

- 📱 **Responsive Design**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack- 🔧 **API Routes**: RESTful API endpoints for all operations

- ✅ **Comprehensive Testing**: API and database integration tests

- **Framework**: Next.js 15.2.4

- **Language**: TypeScript## Tech Stack

- **Styling**: Tailwind CSS

- **UI Components**: shadcn/ui + Radix UI- **Frontend**: Next.js 15.2.4, React, TypeScript

- **Icons**: Lucide React- **Backend**: Next.js API Routes, Node.js

- **State Management**: React Context- **Database**: PostgreSQL with connection pooling

- **HTTP Client**: Native fetch with custom API client- **Styling**: Tailwind CSS, shadcn/ui components

- **State Management**: In-memory store with database persistence

## Project Structure- **Testing**: Node.js test suites



```## Getting Started

bluecart-frontend/

├── app/                    # Next.js 15 App Router### Prerequisites

│   ├── layout.tsx         # Root layout- Node.js 18+ 

│   ├── page.tsx           # Dashboard home- PostgreSQL 12+

│   ├── analytics/         # Analytics pages- npm or pnpm

│   ├── delivery/          # Delivery management

│   ├── hubs/              # Hub management### Installation

│   ├── routes/            # Route management

│   ├── settings/          # User settings1. Clone the repository:

│   ├── shipments/         # Shipment management   ```bash

│   ├── track/             # Shipment tracking   git clone https://github.com/vithaluntold/bluecart-erp.git

│   └── users/             # User management   cd bluecart-erp

├── components/            # Reusable components   ```

│   ├── ui/               # shadcn/ui components

│   ├── dashboard/        # Dashboard components2. Install dependencies:

│   └── layout/           # Layout components   ```bash

├── lib/                  # Utilities and configurations   npm install --legacy-peer-deps

│   ├── api-client.ts     # API client   ```

│   ├── auth-context.tsx  # Authentication context

│   └── utils.ts          # Helper utilities3. Set up environment variables:

├── hooks/                # Custom React hooks   ```bash

├── public/               # Static assets   cp .env.example .env.local

└── styles/               # Global styles   ```

```   

   Update `.env.local` with your PostgreSQL credentials:

## Quick Start   ```

   POSTGRES_HOST=localhost

### Prerequisites   POSTGRES_PORT=5432

- Node.js 18+   POSTGRES_USER=postgres

- pnpm (recommended) or npm   POSTGRES_PASSWORD=your_password

   POSTGRES_DB=shipment_erp

### Installation   ```



1. **Clone and navigate:**4. Set up the database:

   ```bash   ```bash

   git clone <repository-url>   node setup-database.mjs

   cd bluecart-frontend   ```

   ```

5. Run the development server:

2. **Install dependencies:**   ```bash

   ```bash   npm run dev

   pnpm install   ```

   # or

   npm install6. Open [http://localhost:3000](http://localhost:3000) in your browser.

   ```

## API Endpoints

3. **Set up environment:**

   ```bash### Shipments

   cp .env.example .env.local- `GET /api/shipments` - Get all shipments

   ```- `POST /api/shipments` - Create new shipment

- `GET /api/shipments/[id]` - Get shipment by ID

4. **Run development server:**- `PUT /api/shipments/[id]` - Update shipment

   ```bash- `DELETE /api/shipments/[id]` - Delete shipment

   pnpm dev

   # or### Sample API Usage

   npm run dev

   ``````bash

# Create a shipment

5. **Open in browser:**curl -X POST http://localhost:3000/api/shipments \

   ```  -H "Content-Type: application/json" \

   http://localhost:3000  -d '{

   ```    "senderName": "John Doe",

    "senderAddress": "123 Main St",

## Environment Variables    "receiverName": "Jane Smith", 

    "receiverAddress": "456 Oak Ave",

Create a `.env.local` file:    "packageDetails": "Electronics",

    "weight": 2.5,

```env    "serviceType": "standard",

# API Configuration    "cost": 25.00

NEXT_PUBLIC_API_URL=http://localhost:8000  }'

```

# Application Settings

NEXT_PUBLIC_APP_NAME=BlueCart ERP## Project Structure

NEXT_PUBLIC_APP_VERSION=1.0.0

``````

├── app/

## Features Overview│   ├── api/shipments/          # API routes

│   ├── shipments/              # Shipment management pages

### 📦 Shipment Management│   ├── dashboard/              # Dashboard components

- Create new shipments with origin/destination│   └── globals.css             # Global styles

- Track shipment status and updates├── components/

- Assign drivers and routes│   ├── ui/                     # shadcn/ui components

- Bulk operations and filtering│   └── dashboard/              # Dashboard-specific components

├── lib/

### 🏢 Hub Management│   ├── shipment-store.ts       # Data management layer

- View hub performance metrics│   ├── database.ts             # PostgreSQL connection

- Monitor capacity and current load│   └── utils.ts                # Utility functions

- Hub location management├── database/

│   └── schema.sql              # Database schema

### 🛣️ Route Management└── tests/                      # Test files

- Create optimized delivery routes```

- Assign multiple drivers per route

- Route status tracking## Testing



### 👥 User ManagementRun API tests:

- Role-based access control```bash

- User profile managementnode test-api.js

- Team member directory```



### 📊 Analytics DashboardRun database tests:

- Real-time performance metrics```bash

- Revenue and shipment analyticsnode test-postgres.js

- Hub performance insights```

- Interactive charts and graphs

## Contributing

### ⚙️ Settings

- User profile updates1. Fork the repository

- Role and permission management2. Create a feature branch (`git checkout -b feature/amazing-feature`)

- System preferences3. Commit your changes (`git commit -m 'Add amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)

## API Integration5. Open a Pull Request



The frontend connects to the BlueCart ERP Backend:## License



```typescriptThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

// Example API calls

const shipments = await apiClient.getShipments()## Acknowledgments

const newShipment = await apiClient.createShipment(data)

const user = await apiClient.updateUser(id, updates)- Built with [Next.js](https://nextjs.org/)

```- UI components from [shadcn/ui](https://ui.shadcn.com/)

- Icons from [Lucide React](https://lucide.dev/)

## Scripts- Database: [PostgreSQL](https://postgresql.org/)

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Type checking
pnpm type-check   # Run TypeScript compiler check
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build image
docker build -t bluecart-frontend .

# Run container
docker run -p 3000:3000 bluecart-frontend
```

### Manual Build
```bash
# Build static files
pnpm build

# Serve static files
pnpm start
```

## Component Library

Built with shadcn/ui components:
- Tables with sorting and pagination
- Forms with validation
- Modal dialogs and sheets
- Loading states and skeletons
- Toast notifications
- Dark/light theme support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Support

For support and questions:
- Create an issue in the repository
- Check the component documentation
- Review the API client implementation