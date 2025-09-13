export default function OfflinePage() {
  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-100\">
      <div className=\"text-center p-8 max-w-md mx-auto\">
        <div className=\"mb-8\">
          <div className=\"w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30\">
            <svg className=\"w-12 h-12 text-cyan-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
              <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19z\" />
            </svg>
          </div>
          <h1 className=\"text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400\">
            You're Offline
          </h1>
          <p className=\"text-gray-300 mb-6\">
            No internet connection detected. Some features may be limited, but you can still access cached workouts and nutrition plans.
          </p>
        </div>
        
        <div className=\"space-y-4\">
          <div className=\"p-4 rounded-lg bg-gray-800/50 border border-gray-700/50\">
            <h3 className=\"font-semibold text-cyan-400 mb-2\">Available Offline:</h3>
            <ul className=\"text-sm text-gray-300 space-y-1\">
              <li>• Basic workout routines</li>
              <li>• Nutrition guidelines</li>
              <li>• Exercise library</li>
              <li>• Progress tracking</li>
            </ul>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className=\"w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105\"
          >
            Try Again
          </button>
          
          <button 
            onClick={() => window.history.back()}
            className=\"w-full px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800/50 transition-all duration-300\"
          >
            Go Back
          </button>
        </div>
        
        <div className=\"mt-8 text-xs text-gray-500\">
          <p>FitSync AI works offline with cached data.</p>
          <p>Connect to the internet for the full experience.</p>
        </div>
      </div>
    </div>
  )
}