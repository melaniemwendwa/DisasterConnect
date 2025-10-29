# ☁️ Cloudinary Setup - Quick Guide

## ✅ Cloudinary Code Added!

Your backend now automatically uses Cloudinary for permanent image storage when configured.

---

## 🚀 Setup Steps (5 minutes)

### **Step 1: Get Free Cloudinary Account**

1. Sign up: https://cloudinary.com/users/register/free
2. Go to dashboard: https://console.cloudinary.com/
3. Copy these three values:
   - **Cloud Name** (e.g., `dxxx123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

---

### **Step 2: Add to Render**

1. Go to https://dashboard.render.com
2. Click your backend service
3. Go to **"Environment"** tab
4. Add **three** environment variables:

```
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = 123456789012345
CLOUDINARY_API_SECRET = abcdefghijklmnopqrstuvwxyz
```

**⚠️ Replace with YOUR actual values from Cloudinary!**

5. Click **"Save Changes"** (Render will auto-redeploy)

---

### **Step 3: Deploy Code**

```bash
cd /home/kitsune/development/phase5/DisasterConnect
git add server/cloudinary_config.py server/routes/report_route.py
git commit -m "Add Cloudinary for permanent image storage"
git push
```

---

### **Step 4: Test**

1. Wait 2-3 minutes for Render to deploy
2. Upload a disaster report with an image
3. Check Render logs - should see:
   ```
   ☁️ Image uploaded to Cloudinary: https://res.cloudinary.com/...
   ```
4. **Restart backend** - image should still be there! ✅

---

## 🎯 How It Works

**Smart Auto-Selection:**
- ✅ **Cloudinary configured?** → Uploads to cloud (permanent)
- ❌ **No Cloudinary?** → Saves locally (temporary, for dev)

---

## 📊 Benefits

- ✅ **Permanent Storage** - Images never disappear
- ✅ **Fast Loading** - Global CDN
- ✅ **Auto-Optimized** - Compressed, WebP format
- ✅ **Free Tier** - 25GB storage, 25GB bandwidth/month

---

## ✅ Done!

Once you add the 3 env vars to Render and deploy, all new images will be stored permanently on Cloudinary! 🎉
