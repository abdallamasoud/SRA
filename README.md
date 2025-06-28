# SRA - Smart Ranch Application

A comprehensive farm management system built with Angular.

## Features

- User Authentication (Login/Register)
- Dashboard with analytics
- Animal Management
- Feed Management
- Ingredients Management
- Dairy Management
- Vaccination Records
- Reports Generation
- Settings Management

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI (v15 or higher)
- Backend API server (optional - mock data is used when backend is not available)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SRA
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Backend Configuration

The application is configured to work with a backend API at `https://localhost:7174/api/Accounts`. 

### If Backend is Available:
- Uncomment the HTTP calls in `src/app/services/auth.service.ts`
- Comment out the mock implementations
- Ensure your backend server is running on the correct port

### If Backend is Not Available:
- The application uses mock data for authentication
- Registration and login will work with any valid data
- No actual backend communication occurs

## Troubleshooting

### Registration Not Working
1. Check if the backend server is running
2. Verify the API endpoint in `auth.service.ts`
3. Check browser console for error messages
4. Ensure all form fields are filled correctly

### Common Issues
- **CORS Errors**: Configure your backend to allow requests from `http://localhost:4200`
- **404 Errors**: Verify the API endpoints match your backend implementation
- **Form Validation**: Ensure all required fields are filled before submission

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard component
│   │   ├── animals/       # Animal management
│   │   ├── feed/          # Feed management
│   │   └── ...
│   ├── services/          # API services
│   ├── guards/            # Route guards
│   └── shared/            # Shared components
├── assets/                # Static assets
└── ...
```

## Development

- Run `ng generate component component-name` to generate a new component
- Run `ng generate service service-name` to generate a new service
- Run `ng build` to build the project for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
