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

move to dif md

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
source venv/bin/activate
# or
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
# Create .env file in backend/
```

5. Run the backend server:

**Production (recommended):**

```bash
source venv/bin/activate
gunicorn run:app --bind 0.0.0.0:5001
```

**Local development (with debug mode):**

```bash
source venv/bin/activate
FLASK_ENV=development FLASK_DEBUG=True python3 run.py
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
npm run dev
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
