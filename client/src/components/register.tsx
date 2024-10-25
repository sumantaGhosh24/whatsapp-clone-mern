import {FormEvent, useState} from "react";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import axios from "axios";

import {CLOUDINARY_URL, CLOUD_NAME, UPLOAD_PRESET} from "../config";

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [cf_password, setCf_password] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!name || !email || !password || !cf_password) {
      toast.error("Please fill all the fields.", {toastId: "register-error"});

      return;
    }

    if (password !== cf_password) {
      toast.error("Password and confirm password not match.", {
        toastId: "register-error",
      });

      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const {data} = await axios.post(
        "http://localhost:8080/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toast.success("register successful.", {toastId: "register-success"});

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
    } catch (error: any) {
      toast.error(`Register error : ${error.message}`, {
        toastId: "register-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const postDetails = (pics: any) => {
    setLoading(true);

    if (pics === undefined) {
      toast.error("Please select a image first.", {toastId: "register-error"});

      return;
    }

    try {
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", UPLOAD_PRESET);
        data.append("cloud_name", CLOUD_NAME);

        fetch(CLOUDINARY_URL, {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toast.error("Select a image.", {toastId: "register-error"});

        return;
      }
    } catch (error: any) {
      toast.error(`Register error : ${error.message}`, {
        toastId: "register-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold capitalize mb-5">Register User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Upload profile picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: any) => postDetails(e.target.files[0])}
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            onChange={(e: any) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
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
        <div>
          <label htmlFor="cf_password">Confirm Password</label>
          <input
            type="password"
            id="cf_password"
            name="cf_password"
            placeholder="Enter confirm password"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-x-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring"
            onChange={(e: any) => setCf_password(e.target.value)}
            value={cf_password}
            required
          />
        </div>
        <button
          type="submit"
          className="w-fit bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors disabled:bg-green-300 my-5"
          disabled={loading}
        >
          {loading ? "Processing..." : "Register"}
        </button>
      </form>
    </>
  );
};

export default Register;
