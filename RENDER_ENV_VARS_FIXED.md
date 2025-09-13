# 🚀 RENDER ENVIRONMENT VARIABLES - NO DUPLICATES

## ⚠️ DUPLICATE KEYS ERROR FIXED

**Copy these exact variables to Render (one by one, no duplicates):**

### ✅ Required Variables (Add these first):

```
NODE_ENV=production
```

```
PORT=10000
```

```
FRONTEND_URL=https://ai-fitness-platform-dn6v1yomv-krishnas-projects-8872b996.vercel.app
```

```
JWT_SECRET=fitsync-ai-super-secure-jwt-secret-key-2024-render-production
```

```
BCRYPT_ROUNDS=12
```

### 📊 Database Variable (Add after creating PostgreSQL database):

```
DATABASE_URL=[PASTE_YOUR_RENDER_DATABASE_URL_HERE]
```

### 🤖 Optional API Keys (Add if you have them):

```
OPENAI_API_KEY=your_openai_api_key_here
```

```
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

## 🔧 How to Add Variables in Render:

1. **Go to your service** → **Environment** tab
2. **Click "Add Environment Variable"**
3. **Add ONE variable at a time**:
   - Key: `NODE_ENV`
   - Value: `production`
   - Click "Save Changes"
4. **Repeat for each variable**

## ⚡ Database Setup:

1. **Create PostgreSQL database** first: https://dashboard.render.com/new/database
2. **Copy the DATABASE_URL** from database settings
3. **Add DATABASE_URL** to your backend service environment variables

## 🎯 Common Duplicate Key Issues:

- ❌ **DATABASE_URL** added twice (once manually, once auto-generated)
- ❌ **PORT** added multiple times
- ❌ **NODE_ENV** duplicated
- ❌ Same key with different cases (e.g., `port` vs `PORT`)

## ✅ Solution:

1. **Clear all environment variables** in Render
2. **Add variables one by one** from the list above
3. **Check for duplicates** before saving each one

Your backend will deploy successfully once the duplicate keys are resolved! 🚀