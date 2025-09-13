// Railway Deployment Script for FitSync AI Enhanced Backend
const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Railway deployment for FitSync AI Enhanced Backend...\n');

// Step 1: Create Railway project with auto-generated name
console.log('📦 Creating Railway project...');
const initProcess = spawn('railway', ['init'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

initProcess.stdin.write('\n'); // Send empty input for auto-generated name

initProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Failed to create Railway project');
    process.exit(1);
  }
  
  console.log('✅ Railway project created successfully\n');
  
  // Step 2: Add services
  addServices();
});

function addServices() {
  console.log('🗄️ Adding PostgreSQL database...');
  
  const addPostgres = spawn('railway', ['add', 'postgresql'], {
    stdio: 'inherit'
  });
  
  addPostgres.on('close', (code) => {
    if (code !== 0) {
      console.warn('⚠️ PostgreSQL may already exist or failed to add');
    } else {
      console.log('✅ PostgreSQL added successfully');
    }
    
    console.log('🔴 Adding Redis cache...');
    
    const addRedis = spawn('railway', ['add', 'redis'], {
      stdio: 'inherit'
    });
    
    addRedis.on('close', (code) => {
      if (code !== 0) {
        console.warn('⚠️ Redis may already exist or failed to add');
      } else {
        console.log('✅ Redis added successfully');
      }
      
      setEnvironmentVariables();
    });
  });
}

function setEnvironmentVariables() {
  console.log('\n⚙️ Setting environment variables...');
  
  const envVars = [
    'NODE_ENV=production',
    'NEXT_TELEMETRY_DISABLED=1',
    'LOG_LEVEL=info'
  ];
  
  let completed = 0;
  
  envVars.forEach((envVar) => {
    const setVar = spawn('railway', ['variables', 'set', envVar], {
      stdio: 'inherit'
    });
    
    setVar.on('close', (code) => {
      completed++;
      if (completed === envVars.length) {
        console.log('✅ Core environment variables set\n');
        displayRequiredVariables();
        deployApplication();
      }
    });
  });
}

function displayRequiredVariables() {
  console.log('⚠️ IMPORTANT: Please set these variables in Railway dashboard:');
  console.log('   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)');
  console.log('   - DATABASE_URL (automatically set by PostgreSQL service)');
  console.log('   - REDIS_URL (automatically set by Redis service)');
  console.log('   - OPENAI_API_KEY (required for AI features)');
  console.log('   - USDA_API_KEY (optional, for nutrition data)');
  console.log('   - SPOONACULAR_API_KEY (optional, for meal planning)');
  console.log('');
}

function deployApplication() {
  console.log('🚀 Deploying application to Railway...');
  
  const deployProcess = spawn('railway', ['up'], {
    stdio: 'inherit'
  });
  
  deployProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 Deployment completed successfully!');
      console.log('📊 Check your Railway dashboard for deployment status');
      console.log('🔗 Your app will be available at the Railway-provided URL');
      console.log('\n📋 Next steps:');
      console.log('   1. Set required environment variables in Railway dashboard');
      console.log('   2. Configure custom domain (optional)');
      console.log('   3. Set up monitoring and alerts');
      console.log('\n💻 Useful commands:');
      console.log('   - railway logs (view logs)');
      console.log('   - railway open (open dashboard)');
      console.log('   - railway status (check status)');
    } else {
      console.error('❌ Deployment failed. Check Railway dashboard for details.');
    }
  });
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});