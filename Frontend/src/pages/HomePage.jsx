import { motion } from "framer-motion";
import { FaCheckCircle, FaBookOpen, FaChartPie, FaShieldAlt, FaPiggyBank } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();  // Initialize navigate function

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center relative px-6">
      <div className="text-center max-w-4xl mb-8 mt-24">
        <motion.h1 className="text-7xl font-extrabold mb-4 flex justify-center space-x-1">
          {"Welcome to Finova".split("").map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              whileHover={{ y: -10, transition: { type: "spring", stiffness: 200 } }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
        <h2 className="text-3xl text-blue-300">A fusion of finance and innovation.</h2>
        <p className="text-lg text-gray-300 mt-4">
          Take control of your financial future with AI-powered insights, automated tracking, and smart investment strategies.
        </p>
        <motion.button
          className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold rounded-lg shadow-lg transition duration-300"
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/login")}  // Navigate to /login
        >
          Get Started for Free
        </motion.button>
      </div>
   
  



      {/* Features Section */}
      <div className="flex flex-wrap justify-center max-w-6xl w-full px-4 gap-6 mt-10">
        {[
          { title: "AI-Powered Bookkeeping", description: "Categorizes income, tracks expenses, and reconciles accounts automatically." },
          { title: "Smart Tax Optimization", description: "Estimates tax liabilities and suggests deductions to maximize returns." },
          { title: "Personalized Investment Strategies", description: "AI-driven investment planning tailored to your financial goals." },
          { title: "Fraud & Anomaly Detection", description: "AI continuously monitors transactions to detect and prevent fraud." },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex-1 min-w-[300px] p-6 bg-blue-950 rounded-lg shadow-lg text-center border-2 border-blue-400 transition-shadow"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 191, 255, 0.8)" }}
          >
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
              <FaCheckCircle className="text-green-400" /> {item.title}
            </h2>
            <p className="text-gray-300 mt-2">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// AboutPage Component
const AboutPage = () => {
  return (
    <div>
    <div className="h-screen bg-black text-white flex flex-col lg:flex-row items-center justify-center px-48 gap-10">
      <motion.div className="flex-1 text-left max-w-3xl" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-5xl font-extrabold mb-4 text-blue-400">About Finova</h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          The Finova is an intelligent financial management solution designed for individuals and businesses. It automates bookkeeping, categorizes income and expenses, and provides real-time budget tracking. The AI-driven system analyzes spending patterns, optimizes taxes, and recommends personalized investment strategies. Users can connect their bank accounts, digital wallets, and payroll systems for seamless financial integration.The AI-powered budgeting tool suggests smart spending limits and customized financial plans. Users receive automated financial reports and actionable insights to improve decision-making. This app serves as a virtual accountant, reducing financial stress and enhancing financial well-being.
        </p>
      </motion.div>
      <motion.div className="flex-1 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/022/498/429/small_2x/3d-render-business-infographic-with-stock-diagrams-and-statistic-bars-chart-isolated-on-transparent-background-financial-line-graphs-and-charts-for-presentation-and-finance-report-png.png"
          alt="Finova AI Analysis"
          className="w-96 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        />
      </motion.div>
    </div>


    </div>
  );
};






const SecurityPage = () => {
  const securityFeatures = [
    {
        title: "End-to-End Encryption",
        description: "We encrypt all financial data to ensure secure transactions, preventing unauthorized access. Our advanced encryption protocols safeguard sensitive information from potential cyber threats. Every transaction undergoes multiple layers of security to ensure data integrity and confidentiality. With end-to-end encryption, only you have access to your financial details, keeping your investments and assets safe.",
      },
      {
        title: "Regulatory Compliance",
        description: "Finova strictly adheres to RBI guidelines and follows industry best security practices to ensure full compliance. We continuously update our security framework to align with global financial regulations and standards. Regular audits and compliance checks help us maintain transparency and trust with our users. By complying with these regulations, we guarantee a secure and legally protected financial environment for all customers.",
      },
      {
        title: "AI Fraud Detection",
        description: "Our advanced AI monitors transactions in real-time to detect and prevent fraudulent activities efficiently. Machine learning algorithms analyze spending patterns to identify suspicious behaviors and potential threats. Instant alerts are generated for any unusual activity, ensuring that users can act swiftly to prevent fraud. With AI-driven fraud detection, we minimize risks and enhance financial security for all users.",
      },
      
      
  ];

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-extrabold mb-10 text-blue-400">Security & Compliance</h1>
      <p className="text-lg text-gray-300 text-center max-w-3xl mb-6">
        At Finova, security is our top priority. We implement cutting-edge security measures to protect your financial data.
      </p>

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {securityFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="w-[30%] min-w-[250px] h-[60vh] p-6 bg-blue-950 rounded-lg shadow-lg text-center border-2 border-blue-400 flex flex-col justify-between transition-shadow duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 191, 255, 0.8)" }}
          >
            <h2 className="text-2xl font-semibold text-blue-300">{feature.title}</h2>
            <p className="text-gray-300 mb-25 mt-9">{feature.description}</p>
            
          </motion.div>
        ))}
      </div>
    </div>
  );
};




  



// ServicesPage Component
const ServicesPage = () => {
    const services = [
      {
        title: "AI-Based Bookkeeping",
        description: "Our AI-driven system automates income categorization, tracks transactions, and reconciles accounts seamlessly. Say goodbye to manual data entry and let AI ensure accuracy, reducing financial errors and saving time. ",
        icon: <FaBookOpen className="text-white text-6xl my-6" />,
      },
      {
        title: "Personalized Budgeting",
        description: "Gain control over your finances with AI-powered budgeting tools. Our system provides real-time alerts on overspending,  and ensures smart money management for a financially secure future.",
        icon: <FaChartPie className="text-white text-6xl my-6" />,
      },
      {
        title: "Investment & Savings Advisor",
        description: " Identify profitable investment opportunities. Whether you’re planning for retirement or short-term goals, our system helps optimize savings and secure long-term financial growth.",
        icon: <FaPiggyBank className="text-white text-6xl my-6" />,
      },
      {
        title: "Fraud & Anomaly Detection",
        description: "Protect your financial transactions with advanced fraud detection. Our AI-driven security system continuously monitors transactions. Stay secure with real-time alerts and proactive financial fraud prevention measures.",
        icon: <FaShieldAlt className="text-white text-6xl my-6" />,
      },
    ];
  
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-extrabold mb-10 text-center">Our Services</h1>
        <div className="flex justify-center items-center gap-8 max-w-6xl w-full">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="flex-1 p-8 bg-blue-950 rounded-lg shadow-lg text-center min-w-[250px] h-[70vh] flex flex-col items-center justify-between border-2 border-blue-400 transition-all duration-300 group"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 191, 255, 0.8)" }}
            >
              <h2 className="text-2xl font-semibold">{service.title}</h2>
              <div>{service.icon}</div>
              <p className="text-gray-300 text-base leading-relaxed px-4">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ServicesPage;



  

// Export all components as named exports
export { HomePage, AboutPage, ServicesPage,SecurityPage };
