# main.py
# This script sets up a simple backend server using FastAPI.
# Its primary role is to handle user authentication based on credentials
# stored in a MySQL database and issue JWT tokens, as described in the PDF.

import os
import mysql.connector
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
import jwt
from dotenv import load_dotenv

# Load environment variables from a .env file (for database credentials and secret key)
load_dotenv()

# Initialize the FastAPI app
app = FastAPI()

# Configure CORS (Cross-Origin Resource Sharing) to allow requests from the frontend
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:9545",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Connection ---
# Establish a connection to the MySQL database using credentials from environment variables.
# The database should contain a 'voters' table with 'voter_id', 'password', and 'role' columns.
try:
    cnx = mysql.connector.connect(
        user=os.environ['MYSQL_USER'],
        password=os.environ['MYSQL_PASSWORD'],
        host=os.environ['MYSQL_HOST'],
        database=os.environ['MYSQL_DB'],
    )
    cursor = cnx.cursor(dictionary=True) # Use dictionary cursor to get results as dicts
    print("Successfully connected to the database.")
except mysql.connector.Error as err:
    print(f"Database connection error: {err}")
    # Exit if we can't connect to the database, as the app is unusable.
    exit()

# --- Authentication Middleware ---
# This function acts as a dependency that will be run before the login endpoint.
# It checks for a valid Authorization header, simulating a secure endpoint.
async def authenticate(request: Request):
    try:
        # As per the PDF, we expect a Bearer token in the authorization header.
        auth_header = request.headers.get('authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid Authorization header"
            )
        # In this prototype, the "token" is just the voter_id.
        # A real implementation would validate a proper JWT token here.
        api_key = auth_header.replace("Bearer ", "")
        
        # Check if the voter_id from the token exists in the database.
        cursor.execute("SELECT voter_id FROM voters WHERE voter_id = %s", (api_key,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Forbidden: Invalid credentials"
            )
    except Exception as e:
        print(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Forbidden"
        )

# --- Role Retrieval Function ---
async def get_role(voter_id: str, password: str) -> str:
    """Queries the database to find the role of a user based on voter_id and password."""
    try:
        query = "SELECT role FROM voters WHERE voter_id = %s AND password = %s"
        cursor.execute(query, (voter_id, password))
        result = cursor.fetchone()
        if result:
            return result['role']
        else:
            # If no user is found with the given credentials, raise an unauthorized error.
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid voter id or password"
            )
    except mysql.connector.Error as err:
        print(f"Database query error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )

# --- Login Endpoint ---
@app.get("/login")
async def login(request: Request, voter_id: str, password: str):
    """
    Login endpoint. It authenticates the user, gets their role,
    and returns a JWT token.
    """
    # The 'authenticate' function runs first due to the dependency injection pattern in FastAPI,
    # but for clarity, we explicitly call our logic here after the request is received.
    await authenticate(request)
    
    # Get the user's role from the database.
    role = await get_role(voter_id, password)

    # If authentication is successful, generate a JWT token.
    # The token encodes the user's details and is signed with a secret key.
    secret_key = os.environ['SECRET_KEY']
    payload = {'voter_id': voter_id, 'role': role}
    token = jwt.encode(payload, secret_key, algorithm='HS256')

    return {'token': token, 'role': role}

# To run this server:
# 1. Make sure you have a .env file with your DB credentials and a SECRET_KEY.
# 2. Run 'uvicorn main:app --reload' in your terminal.
