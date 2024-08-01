"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "../../public/logo.png";
import Loader from "./components/loaders";
require("./input.css");

interface list_program {
  _id: string;
  nama_program: string;
}

interface peserta {
  nama: string;
  intansi: string;
}

interface program {
  _id: string;
  nama_program: string;
  peserta: peserta[];
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [listPrograms, setListPrograms] = useState<list_program[]>([]);
  const [detailProgram, setDetailProgram] = useState<program>();
  const [filteredName, setFilteredName] = useState<peserta[]>([]);

  const getAllNewProgram = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/api/new_program/list`
      );
      if (res) {
        setLoading(false);
        setListPrograms(res.data.data);
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDetail = async (id: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/api/new_program/detail/${id}`
      );
      setLoading(true);
      if (res) {
        setLoading(false);
        setDetailProgram(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stringShorter = (text: string): string => {
    console.log(text);
    if (text.length > 20) {
      return text.substring(0, 20) + "...";
    } else {
      return text;
    }
  };

  const generatePdf = async (id: string, nama: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/api/new_program/generate-pdf?id=${id}&nama=${nama}`,
        {
          responseType: "blob",
        }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${nama.toUpperCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (detailProgram && detailProgram.peserta) {
      setFilteredName(detailProgram.peserta);
    }
  }, [detailProgram]);

  useEffect(() => {
    getAllNewProgram();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center min-h-screen">
        {!detailProgram && (
          <>
            <Image
              src={Logo}
              alt=""
              className="w-[75%] h-auto min-[850px]:size-[300px]"
            ></Image>
            <div className="container p-5 rounded-lg blue-drop-shadow inner-drop-shadow bg-[#09bfef] min-[850px]:w-[250px]">
              <div className="scrolling-text !text-[#fff]">
                Daftar Pelatihan Rumpen (Dari Tanggal X Bulan 2024)
              </div>
            </div>
            <div className="min-[850px]:w-[350px] flex flex-col flex-grow w-[90%] mt-8 text-[#32373b] m-5 rounded-lg bg-[#e6e6e6] black-drop-shadow ">
              {listPrograms.length > 0 && (
                <table className="w-full h-full">
                  <thead>
                    <tr>
                      <th className="font-semibold opacity-[80%] text-[16px] uppercase text-center p-2">
                        No
                      </th>
                      <th className="font-semibold opacity-[80%] text-[16px] uppercase text-start p-2">
                        Pelatihan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPrograms.map((e, i) => (
                      <>
                        <tr>
                          <td className="p-3 text-[18px] text-center cursor-pointer">
                            {i + 1}
                          </td>
                          <td
                            className="p-3 text-[15px] font-semibold capitalize cursor-pointer"
                            onClick={() => getDetail(e._id)}
                          >
                            {e.nama_program}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              )}
              {listPrograms.length === 0 && (
                <h1 className="m-auto">Belum Ada Program yang diupload</h1>
              )}
            </div>
          </>
        )}

        {detailProgram && (
          <>
            <Image
              src={Logo}
              alt=""
              className="w-[75%] h-auto min-[850px]:size-[300px]"
            ></Image>
            <div className="container p-5 rounded-lg blue-drop-shadow inner-drop-shadow bg-[#09bfef] min-[85px]:w-[250px]">
              <div className="scrolling-text !text-[#fff] capitalize">
                {detailProgram.nama_program}
              </div>
            </div>
            <input
              type="text"
              placeholder="Cari Nama Anda"
              className="input-style m-7"
              onChange={(e) => {
                if (e.target.value.length > 0) {
                  const filtered = detailProgram.peserta.filter((peserta) =>
                    peserta.nama
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  );
                  setFilteredName(filtered);
                } else {
                  setFilteredName(detailProgram.peserta);
                }
              }}
            />
            <div className="flex flex-col flex-grow w-[90%] text-[#32373b] rounded-lg bg-[#e6e6e6] black-drop-shadow min-[850px]:w-[550px]">
              <table className="w-full h-full">
                <thead>
                  <tr>
                    <th className="font-semibold opacity-[80%] text-[16px] uppercase text-center p-2">
                      No
                    </th>
                    <th className="font-semibold opacity-[80%] text-[16px] uppercase text-start p-2">
                      Nama
                    </th>
                    <th className="font-semibold opacity-[80%] text-[16px] uppercase text-start p-2">
                      Intansi
                    </th>
                    <th className="font-semibold opacity-[80%] text-[16px] uppercase text-start p-2">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredName.map((e, i) => (
                    <>
                      <tr>
                        <td className="p-3 text-[18px] text-center">{i + 1}</td>
                        <td className="p-3 text-[15px] font-semibold capitalize ">
                          {stringShorter(e.nama)}
                        </td>
                        <td className="p-3 text-[15px] font-semibold capitalize ">
                          {stringShorter(e.intansi)}
                        </td>
                        <td>
                          <button
                            className="rounded-lg p-2 text-[14px] text-white button-bg ml-auto mr-auto"
                            onClick={() =>
                              generatePdf(detailProgram._id, e.nama)
                            }
                          >
                            Sertifikat
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
