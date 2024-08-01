"use client";
import Cookie from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
require("./style.css");
require("./upload.css");
require("./input.css");
require("./button.css");
require("./loader.css");

interface Program {
  _id: string;
  nama_program: string;
}

export default function Admin() {
  const [cookieValue, setCookieValue] = useState<string>("");
  const [dataProgram, setDataProgram] = useState<Program[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [namaProgram, setNamaProgram] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExcel, setSelectedExcel] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlerDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_HOST}/api/new_program/delete/${id}`,
        {
          headers: {
            Authorization: cookieValue,
          },
        }
      );
      if (res.status === 200) {
        alert("Berhasil menghapus program");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("Gagal menghapus program");
    }
  };

  const handleUpload = async () => {
    if (selectedFile && selectedExcel) {
      const formData = new FormData();
      formData.append("design", selectedFile);
      formData.append("file", selectedExcel);
      formData.append("nama", namaProgram);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}/api/new_program/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: cookieValue,
            },
          }
        );
        if (res.status === 200) {
          alert("Berhasil Menambahkan Program");
          window.location.reload();
        }
      } catch (err: any) {
        console.error("Error uploading file:", err);
        alert(err?.response?.data?.message);
        window.location.reload();
      }
    } else {
      console.error("No file selected");
    }
  };

  const handlerLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/api/user/login`,
        {
          username,
          password,
        }
      );
      Cookie.set("token", res.data.token);
      alert("Berhasil Login");
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const checkCookie = async () => {
      const value = Cookie.get("token");
      if (value) {
        setCookieValue(value);
      }
      setIsLoading(false);
    };

    checkCookie();

    const getData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/api/new_program/list`
        );
        setDataProgram(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  if (isLoading) {
    return (
      <section className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </section>
    );
  }

  return (
    <>
      {!cookieValue ? (
        <div className="container">
          <div className="screen">
            <div className="screen__content">
              <div className="login">
                <div className="login__field">
                  <i className="login__icon fas fa-user"></i>
                  <input
                    type="text"
                    className="login__input"
                    placeholder="User name / Email"
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                </div>
                <div className="login__field">
                  <i className="login__icon fas fa-lock"></i>
                  <input
                    type="password"
                    className="login__input"
                    placeholder="Password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                </div>
                <button className="button login__submit" onClick={handlerLogin}>
                  <span className="button__text">Log In Now</span>
                  <i className="button__icon fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            <div className="screen__background">
              <span className="screen__background__shape screen__background__shape4"></span>
              <span className="screen__background__shape screen__background__shape3"></span>
              <span className="screen__background__shape screen__background__shape2"></span>
              <span className="screen__background__shape screen__background__shape1"></span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="
        w-full h-screen inline-flex 
        justify-between
        max-[500px]:flex
        max-[500px]:flex-col
        max-[500px]:items-center
        max-[500px]:h-[800px]
        "
        >
          <div
            className="
          w-[45%] 
          h-screen 
          bg-gradient 
          flex flex-col 
          justify-center 
          items-center
          max-[500px]:w-11/12
          max-[500px]:h-fit
          max-[500px]:mt-6
          "
          >
            <div className="group">
              <label
                className="!text-black !text-[15px] !font-montserrat"
                htmlFor="namaProgram"
              >
                Nama Program
              </label>
              <input
                type="text"
                className="input"
                onChange={(e) => setNamaProgram(e.target.value)}
                id="namaProgram"
              />
              <span className="highlight"></span>
              <span className="bar"></span>
            </div>
            <label
              className="custum-file-upload m-10 static max-[500px]:!w-[90%] max-[500px]:m-5"
              htmlFor="fileProgram"
            >
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill=""
                  viewBox="0 0 24 24"
                >
                  <g strokeWidth={0} id="SVGRepo_bgCarrier"></g>
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    id="SVGRepo_tracerCarrier"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill=""
                      d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
              <div className="text">
                <span>Click to upload image</span>
              </div>
              <input
                type="file"
                id="fileProgram"
                name="file"
                className=""
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </label>
            <button className="excel">
              <svg
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 50 50"
              >
                <path
                  d="M28.8125 .03125L.8125 5.34375C.339844 
    5.433594 0 5.863281 0 6.34375L0 43.65625C0 
    44.136719 .339844 44.566406 .8125 44.65625L28.8125 
    49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 
    50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 
    30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 
    .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 
    6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 
    29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 
    43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 
    13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 
    21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 
    22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 
    15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 
    28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 
    27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 
    14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 
    20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"
                ></path>
              </svg>
              Upload File
              <input
                className="file"
                name="text"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedExcel(e.target.files[0]);
                  }
                }}
              />
            </button>

            <button
              className="text-[15px] mt-5 h-fit w-fit"
              onClick={handleUpload}
            >
              Upload Program
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </div>
          <div
            className="listProgram w-[45%] h-screen flex overflow-y-scroll
              flex-col justify-center font-montserrat font-bold 
              max-[500px]:w-11/12
              max-[500px]:h-[40%]
              max-[500px]:items-center
            "
          >
            <h1 className="text-[40px] max-[500px]:text-center">
              List Program
            </h1>
            <ol className="mt-5 flex flex-col max-[500px]:max-h-[95%] max-[500px]:overflow-y-scroll">
              {dataProgram.map((item) => (
                <li
                  key={item._id}
                  className="w-[300px] mt-3 p-3 rounded-full font-semibold inline-flex justify-around items-center bg-white"
                >
                  {item.nama_program}
                  <MdDelete
                    className="hover:cursor-pointer text-[red] size-8"
                    onClick={() => handlerDelete(item._id)}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
