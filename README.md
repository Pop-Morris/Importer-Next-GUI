# Subscriber Importer (Next.js + Tailwind)

A simple web interface for uploading CSV subscriber data to BigCommerce. Built with **Next.js** (App Router) and styled using **Tailwind CSS**.

## Features

- **CSV Upload**: Easily upload your `.csv` file containing subscriber info.
- **Credentials Input**: Enter your BigCommerce `store_hash` and `auth_token`.
- **Sequential POST Requests**: Sends subscriber data to the BigCommerce API one by one.
- **Tailwind Styling**: Clean, modern UI components.

## Getting Started

1. **Clone this Repository**  
   ```bash
   git clone https://github.com/Pop-Morris/Importer-Next-GUI.git
   ```
2. **Install Dependencies**  
   ```bash
   cd subscriber-importer-next-app
   npm install
   ```

3. **Run Dev Server**  
   ```bash
   npm run dev
   ```
## Usage
1. Enter Credentials: Provide your BigCommerce store_hash and auth_token.
2. Select CSV File: Click “Choose File” and pick a .csv.
3. Upload & Process: Click “Upload & Process” to parse and send subscribers to BigCommerce.

## Project Structure

```
subscriber-importer-next-app/
├─ src/
│  ├─ app/
│  │  ├─ page.js          
│  │  └─ api/
│  │     └─ process-csv/
│  │        └─ route.js   # API route for processing CSV
├─ public/
├─ styles/                
├─ .gitignore
├─ package.json
└─ tailwind.config.js
```
## Dependencies
* Next.js: React framework for production
* React: JavaScript library for building user interfaces
* Tailwind CSS: Utility-first CSS framework
* csv-parse: For parsing CSV content
* axios: For making HTTP requests to BigCommerce





  
