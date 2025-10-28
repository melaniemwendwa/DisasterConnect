# 🔧 CRITICAL: Force Python 3.11 on Render

## ⚠️ The Problem

Render is using **Python 3.13.4** but we need **Python 3.11.x** for compatibility.
The `runtime.txt` file is **ignored by Render** (it's a Heroku convention).

## ✅ Solution: Set Python Version in Render Dashboard

### Step 1: Go to Render Dashboard
1. Log in to https://dashboard.render.com
2. Click on your **DisasterConnect** service

### Step 2: Set Environment Variable
1. Go to the **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add this variable:

   ```
   Key:   PYTHON_VERSION
   Value: 3.11.9
   ```

4. Click **"Save Changes"**

### Step 3: Manual Deploy
1. Go to the **"Manual Deploy"** section
2. Click **"Deploy latest commit"**
3. Wait for build to complete

## 📊 Expected Success Output

After setting Python 3.11, you should see:

```
==> Building with Python 3.11.9
✅ Python 3.11.9 environment created

Installing dependencies...
✅ psycopg[binary]==3.2.12 installed successfully

Running app...
[config] SECRET_KEY set: True
⚙️ Raw DATABASE_URL from environment: postgresql://...
🔍 URL starts with: 'postgresql://...'
🔄 Forced replacement to postgresql+psycopg://
✅ Final protocol: postgresql+psycopg://
✅ Connected to: dpg-...oregon-postgres.render.com/disasterconnect_db
🔧 SQLALCHEMY_DATABASE_URI set: postgresql+psycopg://...

[INFO] Starting gunicorn
✅ Deploy successful!
```

## 🎯 Alternative: Use Render Blueprint

If environment variable doesn't work, create `render.yaml`:

```yaml
services:
  - type: web
    name: disasterconnect-api
    env: python
    runtime: python-3.11.9
    buildCommand: cd server && pip install -r requirements.txt && flask db upgrade
    startCommand: cd server && gunicorn app:app
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: disasterconnect_db
          property: connectionString
      - key: PYTHON_VERSION
        value: "3.11.9"
```

## 🚨 If Still Fails

The improved `config.py` now forces URL replacement regardless, so even with Python 3.13 it should work. But Python 3.11 is recommended for stability.

Check logs for:
- ✅ `🔄 Forced replacement to postgresql+psycopg://`
- ✅ `✅ Final protocol: postgresql+psycopg://`

If you see those, the connection should work!
