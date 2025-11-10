import { useState, type ChangeEvent } from "react";
import ChatbotImg from "../assets/ChatbotImg.png";
import { useUserStore } from "../store/user";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const HomeView = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setUser = useUserStore((set) => set.setUser);
  const navigate = useNavigate();

  const createUser = async () => {
    if (!name || !email) {
      setError("Name and Email are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/register-user`, { name, email });

      setUser(data.userId, data.name);
      navigate("/chat");
    } catch (err) {
      setError(`Something went wrong: ${err}. Please try again`);
      console.log(import.meta.env.VITE_API_URL);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="p-8 bg-gray-800 w-full rounded-lg shadow-lg max-w-md">
        <img src={ChatbotImg} alt="image of Robot" className="mx-auto w-24 h-24 mb-4" />
        <h1 className="text-2xl font-semibold mb-4 text-center">Welcome to Chat AI</h1>

        <input
          type="text"
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          placeholder="Name"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <input
          type="email"
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <button
          onClick={createUser}
          className={`w-full p-3 mt-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Start Chat"}
        </button>

        {error?.trim() !== "" && <p className="text-red-400 mt-5 text-center wrap-break-word">{error}</p>}
      </div>
    </div>
  );
};
