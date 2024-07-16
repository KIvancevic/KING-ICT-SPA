# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Description of CI/CD and Security Measures for Data Protection and Secure Data Transmission and Storage

- `Link to download file`:https://www.file.io/

# Project Overview

This project is a Single Page Application (SPA) developed using React, which displays a product catalog with advanced filtering, sorting, and pagination features. It supports viewing and adding products to a cart and distinguishes between logged-in and anonymous users.

The application uses the dummyjson API for fetching product and user data.

## Folder Structure

- **src/**
  - **assets/**: Contains SVG assets
    - `cart.svg`
    - `react.svg`
    - `user.svg`
  - **components/**: Reusable React components
    - `Filter.css`
    - `Filter.jsx`
    - `Loader.css`
    - `Loader.jsx`
    - `Pagination.css`
    - `Pagination.jsx`
    - `ProductCard.css`
    - `ProductCard.jsx`
    - `ProductModal.css`
    - `ProductModal.jsx`
    - `SearchBar.css`
    - `SearchBar.jsx`
    - `Sort.css`
    - `Sort.jsx`
    - `Toast.css`
    - `Toast.jsx`
  - **pages/**: Page components
    - `Cart.css`
    - `Cart.jsx`
    - `LoginForm.css`
    - `LoginForm.jsx`
    - `ProductList.css`
    - `ProductList.jsx`
    - `ProfilePage.css`
    - `ProfilePage.jsx`
  - **redux/**: Redux related files
    - **actions/**
      - `cartActions.jsx`
      - `productActions.jsx`
      - `userActions.jsx`
    - **middleware/**
      - `tokenMiddleware.jsx`
    - **reducers/**
      - `cartReducer.jsx`
      - `index.jsx`
      - `productReducer.jsx`
      - `userReducer.jsx`
    - **selectors/**
      - `cartSelectors.jsx`
    - **services/**
      - `api.jsx`
    - `store.jsx`
    - `types.jsx`
  - **test/**: Test files
  - `App.css`: Global styles
  - `App.jsx`: Main App component
  - `index.css`: Index styles
  - `index.html`: Main HTML file
  - `index.jsx`: Entry point
  - `main.jsx`: Main JS file
  - `setupTests.jsx`: Setup for tests
  - `.babelrc`: Babel configuration
  - `.eslintrc.js`: ESLint configuration
  - `.gitignore`: Git ignore file
  - `package.json`: NPM package file
  - `README.md`: Project documentation
  - `vite.config.tsx`: Vite configuration

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Redux:** A predictable state container for JavaScript apps.
- **React Router:** A collection of navigational components.
- **CSS Modules:** A CSS file in which all class and animation names are scoped locally by default.
- **Vite:** A build tool that aims to provide a faster and leaner development experience for modern web projects.

## Features

- Product catalog with image, name, price, and short description.
- Advanced filtering by category and price range.
- Sorting by price and name.
- Search bar for product names.
- Pagination to handle large data sets.
- Add to cart functionality with local storage or session storage.
- User authentication and token refresh mechanism.
- Responsive design for desktop and mobile devices.

# Setup and Installation

1. Clone the repository: `git clone https://github.com/KIvancevic/KING-ICT-SPA.git`

2. Install dependencies:

- `cd yourproject`
- `npm install`

3. Start the development server: `npm run dev`

4. Open your browser and navigate to: http://localhost:5173/

## Usage

Once the development server is running, you can:

- Browse the product catalog.
- Use the filter and sort options to refine the product list.
- Search for products by name.
- View product details in a modal.
- Add products to the cart and view the cart.
- Login with user credentials from: https://dummyjson.com/users (take username and password from wanted login user)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
