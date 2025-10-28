#!/bin/bash

echo "🔍 Verifying Deployment Configuration..."
echo ""

# Check runtime.txt location
if [ -f "runtime.txt" ]; then
    echo "✅ runtime.txt found in root directory"
    echo "   Python version: $(cat runtime.txt)"
else
    echo "❌ runtime.txt NOT found in root directory!"
    exit 1
fi

# Check requirements.txt
if grep -q "psycopg\[binary\]" server/requirements.txt; then
    echo "✅ psycopg[binary] found in requirements.txt"
else
    echo "❌ psycopg[binary] NOT found in requirements.txt!"
    exit 1
fi

# Check for backports.zoneinfo (should NOT exist)
if grep -q "backports.zoneinfo" server/requirements.txt; then
    echo "❌ backports.zoneinfo still in requirements.txt! Remove it!"
    exit 1
else
    echo "✅ backports.zoneinfo removed from requirements.txt"
fi

# Check config.py for correct driver
if grep -q "postgresql+psycopg://" server/config.py; then
    echo "✅ config.py uses postgresql+psycopg:// driver"
else
    echo "❌ config.py does NOT use postgresql+psycopg:// driver!"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Ready to deploy!"
echo ""
echo "Next steps:"
echo "  1. git add runtime.txt server/Pipfile server/Pipfile.lock server/requirements.txt server/config.py"
echo "  2. git commit -m 'Fix deployment: Python 3.11, psycopg v3'"
echo "  3. git push"
echo "  4. Trigger manual deploy on Render"
