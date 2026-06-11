# TP06 - End-to-End Testing with Playwright

## Target Website

https://www.saucedemo.com

## Objective

This project contains end-to-end tests for Sauce Demo using Playwright.  
The tests cover homepage loading, login, cart, checkout, validation, sorting, logout, and multi-browser execution.

## Tools Used

- Node.js
- Playwright
- TypeScript
- Chromium and Firefox browsers

## Test Coverage

### Smoke Test
- Check that Sauce Demo homepage loads
- Check that login fields and button are visible

### Login Tests
- Login with valid credentials
- Login with wrong password
- Login with locked out user

### Cart Tests
- Add product to cart
- View cart page
- Remove item from cart

### Checkout Tests
- Complete checkout successfully
- Validate checkout error when required information is missing

### Challenge Tests
- Sort products by price from low to high
- Logout successfully
- Run tests on Chromium and Firefox

## How to Install

```bash
npm install
npx playwright install