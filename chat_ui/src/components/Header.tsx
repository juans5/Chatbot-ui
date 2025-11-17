import { useNavigate } from "react-router-dom";
import ChatbotImg from "../assets/ChatbotImg.png";
import { useUserStore } from "../store/user";

export const Header = () => {
  const navigate = useNavigate();
  const storeLogout = useUserStore((state) => state.logOut);

  const logout = () => {
    storeLogout();
    navigate("/");
  };

  return (
    <div className="py-4 px-12 bg-gray-800 shadow-ml flex justify-between items-center">
      <img src={ChatbotImg} alt="" className="w-12 h-12" />
      <h1 className="text-3xl text-cyan-500 font-bold"> ChatBot Agent</h1>
      <button
        onClick={logout}
        className="py-3 px-5 border-none text-black font-semibold bg-cyan-500 rounded-3xl cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-cyan-400"
      >
        Logout
      </button>
    </div>
  );
};
