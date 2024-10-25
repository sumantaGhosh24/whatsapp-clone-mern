import {useEffect, useState} from "react";
import {useNavigate} from "react-router";

import Login from "../components/login";
import Register from "../components/register";

function Home() {
  const [openTab, setOpenTab] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo") || "null");

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-center text-green-600 font-bold mb-10 text-2xl">
        Whatsapp Clone
      </h2>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <button
                className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full ${
                  openTab === 1
                    ? "text-white bg-green-600"
                    : "text-green-600 bg-white"
                }`}
                onClick={() => setOpenTab(1)}
              >
                Register
              </button>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <button
                className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full ${
                  openTab === 2
                    ? "text-white bg-green-600"
                    : "text-green-600 bg-white"
                }`}
                onClick={() => setOpenTab(2)}
              >
                Login
              </button>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"}>
                  <Register />
                </div>
                <div className={openTab === 2 ? "block" : "hidden"}>
                  <Login />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
