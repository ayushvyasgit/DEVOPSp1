import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

function DeployForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [platform, setPlatform] = useState("AWS");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeploy = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/deploy", {
        repoUrl,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Deployment failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-lg mx-auto mt-20 p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl"
    >
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold text-center text-gray-800 mb-8"
      >
        Deploy Your Application
      </motion.h2>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="repoUrl" className="block text-gray-700 font-medium mb-2">
          GitHub Repository URL
        </label>
        <input
          id="repoUrl"
          type="text"
          placeholder="https://github.com/username/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="platform" className="block text-gray-700 font-medium mb-2">
          Platform
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="AWS">AWS</option>
        </select>
      </motion.div>

      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDeploy}
        disabled={isLoading || !repoUrl.trim()}
        className={`w-full p-3 text-white rounded-lg flex items-center justify-center transition-all duration-200 ${
          isLoading || !repoUrl.trim()
            ? "bg-blue-300 opacity-50 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Deploying...
          </>
        ) : (
          "Deploy Now"
        )}
      </motion.button>
    </motion.div>
  );
}

export default DeployForm;