"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Meme {
  id: string;
  name: string;
  url: string;
  box_count: number;
}

const Home = () => {
  const [isdata, Setdata] = useState<Meme[]>([]);
  const [isloading, Setloading] = useState(false);

  useEffect(() => {
    getdata();
  }, []);

  async function getdata() {
    Setloading(true);
    try {
      const res = await fetch('https://api.imgflip.com/get_memes');
      const { data } = await res.json();
      Setdata(data.memes);
      console.log(data.memes);
      Setloading(false);
    } catch (error) {
      console.log(error);
    } finally {
      Setloading(false);
    }
  }

  return (
    <>
      <h1 className="text-center text-5xl mt-5 mb-5">All MEMES</h1>
      <div className="flex justify-center items-center gap-5 flex-wrap mt-5">
        {isloading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
          </div>
        ) : (
          isdata.map((item) => (
            <div key={item.id} className="max-w-sm rounded overflow-hidden shadow-lg h-[30rem]">
              <Image
                className="w-[300px] h-[18rem]"
                src={item.url}
                alt={item.name}
                width={400}
                height={300}
                objectFit="cover"
              />
              <div className="px-6 py-4 flex justify-center">
                <div className="font-bold text-xl mb-2">
                  {item.name} - Boxes: {item.box_count} 
                  <button className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
                    <Link
                      href={{
                        pathname: "SinglePage",
                        query: {
                          url: item.url,
                          id: item.id,
                          count: item.box_count, 
                        },
                      }}
                    >
                      Generate Meme
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Home;
