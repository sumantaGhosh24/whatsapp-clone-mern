import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import axios from "axios";

import {ChatState} from "../context/chat-provider";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {setUser} = ChatState();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill all the fields.", {toastId: "login-error"});

      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const {data} = await axios.post(
        "http://localhost:8080/api/user/login",
        {email, password},
        config
      );

      toast.success("Login successful.", {toastId: "login-success"});

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
    } catch (error: any) {
      toast.error(`Login error : ${error.message}`, {toastId: "login-error"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold capitalize mb-5">Login User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            onChange={(e: any) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            onChange={(e: any) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="w-fit bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors disabled:bg-green-300 my-5"
          disabled={loading}
        >
          {loading ? "Processing..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default Login;
