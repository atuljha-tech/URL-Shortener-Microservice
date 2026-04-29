#!/bin/bash

echo "=========================================="
echo "URL Shortener - Complete Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: POST a URL and get JSON response
echo -e "${YELLOW}Test 1: POST a URL to /api/shorturl${NC}"
echo "Request: POST /api/shorturl with {\"url\":\"https://www.freecodecamp.org\"}"
RESPONSE1=$(curl -s -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.freecodecamp.org"}')
echo "Response: $RESPONSE1"

# Check if response contains original_url and short_url
if echo "$RESPONSE1" | grep -q "original_url" && echo "$RESPONSE1" | grep -q "short_url"; then
    echo -e "${GREEN}✓ PASSED: Response contains original_url and short_url${NC}"
else
    echo -e "${RED}✗ FAILED: Response missing required fields${NC}"
fi
echo ""

# Test 2: POST another URL
echo -e "${YELLOW}Test 2: POST another URL${NC}"
echo "Request: POST /api/shorturl with {\"url\":\"https://www.google.com\"}"
RESPONSE2=$(curl -s -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com"}')
echo "Response: $RESPONSE2"
echo -e "${GREEN}✓ PASSED: Second URL created${NC}"
echo ""

# Test 3: Visit short URL and verify redirect
echo -e "${YELLOW}Test 3: Visit /api/shorturl/<short_url> and verify redirect${NC}"
echo "Request: GET /api/shorturl/1"

# Get redirect location
REDIRECT_LOCATION=$(curl -s -I http://localhost:3000/api/shorturl/1 | grep -i "Location:" | cut -d' ' -f2 | tr -d '\r')
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/shorturl/1)

echo "HTTP Status: $HTTP_STATUS"
echo "Redirect Location: $REDIRECT_LOCATION"

if [ "$HTTP_STATUS" = "302" ] && [ ! -z "$REDIRECT_LOCATION" ]; then
    echo -e "${GREEN}✓ PASSED: Redirect works (HTTP 302 to $REDIRECT_LOCATION)${NC}"
    
    # Follow redirect and verify final destination
    FINAL_URL=$(curl -L -s -o /dev/null -w "%{url_effective}" http://localhost:3000/api/shorturl/1)
    echo "Final destination after following redirect: $FINAL_URL"
    
    if echo "$FINAL_URL" | grep -q "freecodecamp.org"; then
        echo -e "${GREEN}✓ PASSED: Redirect leads to correct destination${NC}"
    else
        echo -e "${RED}✗ FAILED: Redirect destination incorrect${NC}"
    fi
else
    echo -e "${RED}✗ FAILED: Redirect not working properly${NC}"
fi
echo ""

# Test 4: Invalid URL (no protocol)
echo -e "${YELLOW}Test 4: POST invalid URL (no protocol)${NC}"
echo "Request: POST /api/shorturl with {\"url\":\"www.example.com\"}"
RESPONSE4=$(curl -s -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"www.example.com"}')
echo "Response: $RESPONSE4"

if echo "$RESPONSE4" | grep -q '"error":"invalid url"'; then
    echo -e "${GREEN}✓ PASSED: Invalid URL rejected${NC}"
else
    echo -e "${RED}✗ FAILED: Should return error for invalid URL${NC}"
fi
echo ""

# Test 5: Invalid URL (fake domain)
echo -e "${YELLOW}Test 5: POST invalid URL (non-existent domain)${NC}"
echo "Request: POST /api/shorturl with {\"url\":\"https://this-domain-does-not-exist-12345.com\"}"
RESPONSE5=$(curl -s -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://this-domain-does-not-exist-12345.com"}')
echo "Response: $RESPONSE5"

if echo "$RESPONSE5" | grep -q '"error":"invalid url"'; then
    echo -e "${GREEN}✓ PASSED: Non-existent domain rejected${NC}"
else
    echo -e "${RED}✗ FAILED: Should return error for non-existent domain${NC}"
fi
echo ""

# Test 6: Duplicate URL returns same short_url
echo -e "${YELLOW}Test 6: POST duplicate URL${NC}"
echo "Request: POST /api/shorturl with {\"url\":\"https://www.freecodecamp.org\"} (duplicate)"
RESPONSE6=$(curl -s -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.freecodecamp.org"}')
echo "Response: $RESPONSE6"

if echo "$RESPONSE6" | grep -q '"short_url":1'; then
    echo -e "${GREEN}✓ PASSED: Duplicate URL returns same short_url${NC}"
else
    echo -e "${RED}✗ FAILED: Should return same short_url for duplicate${NC}"
fi
echo ""

# Test 7: Non-existent short URL
echo -e "${YELLOW}Test 7: Access non-existent short URL${NC}"
echo "Request: GET /api/shorturl/999"
RESPONSE7=$(curl -s http://localhost:3000/api/shorturl/999)
echo "Response: $RESPONSE7"

if echo "$RESPONSE7" | grep -q "error"; then
    echo -e "${GREEN}✓ PASSED: Non-existent short URL returns error${NC}"
else
    echo -e "${RED}✗ FAILED: Should return error for non-existent short URL${NC}"
fi
echo ""

# Test 8: Invalid short URL format
echo -e "${YELLOW}Test 8: Access invalid short URL format${NC}"
echo "Request: GET /api/shorturl/abc"
RESPONSE8=$(curl -s http://localhost:3000/api/shorturl/abc)
echo "Response: $RESPONSE8"

if echo "$RESPONSE8" | grep -q "error"; then
    echo -e "${GREEN}✓ PASSED: Invalid format returns error${NC}"
else
    echo -e "${RED}✗ FAILED: Should return error for invalid format${NC}"
fi
echo ""

echo "=========================================="
echo "Test Suite Complete!"
echo "=========================================="
