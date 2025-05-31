# Statify

## Overview

**Statify** is a web application that provides users with personalised music insights similar to Spotify Wrapped. It analyses a user's listening history through the Spotify API and presents engaging visualisations of their music preferences and habits.

## Key Features

- User authentication with Spotify
- Analysis of top tracks, artists, and genres
- Visualisation of listening patterns and preferences
- Insights into music taste and discovery
- Shareable results

## Tech Stack

- **Backend**: Python/Flask
- **Frontend**: React
- **Database**: SQLite (with potential migration to PostgreSQL for production)
- **Authentication**: OAuth 2.0 for Spotify API

## Installation

1. Clone repo:
```bash
git clone https://github.com/yourusername/Statify.git
cd Statify
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Create .env file

5. Run the Flask server:
```bash
python run.py
```
The backend server will start at http://127.0.0.1:5001

## Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```
The frontend will be available at http://127.0.0.1:3000

## Project Structure

The project is divided into several phases:
- **Phase 1**: Setup & Authentication
- **Phase 2**: Data Retrieval & Processing
- **Phase 3**: Frontend Development & Visualisation
- **Phase 4**: Integration & Polish
- **Phase 5**: Testing & Deployment

For detailed information about each phase, see [PLAN.md](PLAN.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
