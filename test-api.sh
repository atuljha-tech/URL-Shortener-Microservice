#!/bin/bash

echo "==================================="
echo "URL Shortener API Test Script"
echo "==================================="
echo ""

# Test 1: Valid URL
echo "Test 1: Creating short URL for https://www.freecodecamp.org"
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.freecodecamp.org"}'
echo -e "\n"

# Test 2: Another valid URL
echo "Test 2: Creating short URL for https://www.google.com"
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com"}'
echo -e "\n"

# Test 3: Invalid URL (no protocol)
echo "Test 3: Testing invalid URL (no protocol)"
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"www.example.com"}'
echo -e "\n"

# Test 4: Invalid URL (fake domain)
echo "Test 4: Testing invalid URL (fake domain)"
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://this-is-not-a-real-domain-12345.com"}'
echo -e "\n"

# Test 5: Redirect test
echo "Test 5: Testing redirect (visit http://localhost:3000/api/shorturl/1 in browser)"
echo "Or run: curl -L http://localhost:3000/api/shorturl/1"
echo ""

echo "==================================="
echo "Tests completed!"
echo "==================================="
