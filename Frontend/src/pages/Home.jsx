const HomePage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-1/5 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Finance App</h1>
        <ul className="w-full">
          {['Home', 'Login', 'Register'].map((item, index) => (
            <li key={index} className="w-full text-center py-3 hover:bg-blue-700 cursor-pointer transition duration-300">
              {item}
              <hr className="border-t border-blue-400 my-2" />
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="w-4/5 p-10">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">Welcome to FinanceHub</h1>
          <p className="text-lg text-gray-700 mt-4">Manage your stocks, bonds, and insurance effortlessly. Get real-time insights and optimize your investments with our intuitive platform.</p>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-900">Stock Management</h2>
            <p className="text-gray-700 mt-2">Track and analyze your stock investments with detailed insights.</p>
          </div>
          <div className="p-6 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-900">Bonds & Insurance</h2>
            <p className="text-gray-700 mt-2">Plan and secure your future with smart bond and insurance investments.</p>
          </div>
          <div className="p-6 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-900">Real-time Analytics</h2>
            <p className="text-gray-700 mt-2">Make informed financial decisions with real-time market trends.</p>
          </div>
          <div className="p-6 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-900">Portfolio Optimization</h2>
            <p className="text-gray-700 mt-2">Maximize returns with AI-driven investment strategies.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
