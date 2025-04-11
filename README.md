# RetailFlow

RetailFlow is a modern, open-source retail management system built with Next.js, TypeScript, and Firebase. It provides a comprehensive solution for managing products, customers, suppliers, and sales in a retail environment.

## Features

- **Product Management**: Track inventory, prices, and product details
- **Customer Management**: Maintain customer information and purchase history
- **Supplier Management**: Manage supplier relationships and orders
- **Sales Tracking**: Monitor sales performance and generate reports
- **Role-Based Access Control**: Secure access with different user roles (admin, staff)
- **Real-time Updates**: Firebase-powered real-time data synchronization
- **Modern UI**: Clean and intuitive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **UI Components**: Custom components with accessibility in mind
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/retailflow.git
cd retailflow
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Create a web app in your Firebase project
   - Copy the Firebase configuration to `.env.local`

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/          # Utility functions and services
├── pages/        # Next.js pages
├── types/        # TypeScript type definitions
└── utils/        # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
