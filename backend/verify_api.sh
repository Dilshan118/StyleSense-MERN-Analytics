#!/bin/bash

echo "1. Testing Login (Seeded User)..."
# Use 127.0.0.1 and -v for verbose
LOGIN_RESPONSE=$(curl -v -X POST http://127.0.0.1:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@stylesense.com", "password": "password123"}' 2>&1)

echo "Response Raw: $LOGIN_RESPONSE"
echo -e "\n"

# Extract token (simple grep, might need adjustment based on verbose output)
# Since we capture stderr (2>&1), the output will contain curl logs too.
# We should separate them or just look for the token in the whole blob.

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed, cannot proceed."
  exit 1
fi

echo "Token received: $TOKEN"

echo "2. Testing Get Products..."
curl -s http://127.0.0.1:5001/api/products | head -c 500
echo -e "\n... (truncated)"

echo "3. Testing Analytics Prediction..."
curl -v http://127.0.0.1:5001/api/analytics/predict
echo -e "\n"
