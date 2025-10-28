# Render Deployment Fix - Complete

## ✅ Issues Fixed

1. **PostgreSQL Driver**: Switched from `psycopg2-binary` to `psycopg` (v3) for better Python 3.11+ support
2. **Database URL**: Updated config to use `postgresql+psycopg://` instead of `postgresql+psycopg2://`
3. **Python Version**: Set to Python 3.11.9 via `runtime.txt` to avoid Python 3.13 compatibility issues
4. **Removed backports.zoneinfo**: Not needed for Python 3.9+ and causes build failures on newer Python

## 📝 Files Changed

- `server/Pipfile` - Updated dependencies and Python version to 3.11
- `server/Pipfile.lock` - Regenerated with new dependencies
- `server/requirements.txt` - Removed backports.zoneinfo, includes psycopg v3
- `server/runtime.txt` - NEW: Forces Python 3.11.9 on Render
- `server/config.py` - Uses `postgresql+psycopg://` driver

## 🚀 Render Configuration

### Build Command:
```bash
cd server && pip install -r requirements.txt && flask db upgrade
```

### Start Command:
```bash
cd server && gunicorn app:app
```

### Environment Variables:
- `DATABASE_URL` - Auto-set by Render PostgreSQL
- `SECRET_KEY` - Your secure secret key
- `OPENAI_API_KEY` - Your OpenAI API key
- `FRONTEND_URL` - (Optional) Your frontend URL for CORS

## 🎯 Deploy Now

```bash
git add server/Pipfile server/Pipfile.lock server/requirements.txt server/runtime.txt server/config.py RENDER_DEPLOY.md
git commit -m "Fix: Python 3.11, psycopg v3, remove backports.zoneinfo"
git push
```

Then trigger manual deploy on Render dashboard.

## ✨ Expected Success Output

```
✅ Converted DATABASE_URL to: postgresql+psycopg://...
🔧 Config SQLALCHEMY_DATABASE_URI set to: postgresql+psycopg://...
```

Your app should start successfully! 🎉
