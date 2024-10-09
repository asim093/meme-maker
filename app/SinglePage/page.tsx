"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

const CreateMeme = ({ searchParams }: { searchParams: { id: string; url: string; count: number } }) => {
    const [meme, setMeme] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    function download(fileUrl: string, fileName: string) {
        fetch(fileUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob(); 
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob); 
                const a = document.createElement("a");
                a.href = url;
                a.setAttribute("download", fileName); 
                document.body.appendChild(a);
                a.click(); 
                a.remove(); 
                window.URL.revokeObjectURL(url); 
            })
            .catch(error => console.error('Download failed:', error));
    }


    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array.from({ length: searchParams.count }, () => null));

    const createMeme = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const texts = inputRefs.current.map(ref => ref?.value || '');

        try {
            const data = await fetch(`https://api.imgflip.com/caption_image?template_id=${searchParams.id}&username=asimusman8899&password=asimusman8899@12345&${texts.map((text, index) => `text${index}=${encodeURIComponent(text)}`).join('&')}`, {
                method: 'POST'
            });
            const response = await data.json();

            if (response.success) {
                console.log('Meme created successfully:', response.data.url);
                setMeme(response.data.url);
            } else {
                setError(response.error_message);
                console.error('Meme creation failed:', response.error_message);
            }
        } catch (error) {
            setError('An error occurred while creating the meme.');
            console.error('Error creating meme:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-5 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-semibold mb-4">Create Your Meme</h2>

            {meme ? (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Your Meme:</h3>
                    <Image src={meme} width={200} height={200} alt='Generated Meme' />
                    <button
                        onClick={() => download(meme, "meme.png")}
                        className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                        Download Meme
                    </button>
                </div>
            ) : (
                <div className="flex flex-col justify-center gap-4 w-full max-w-md">
                    <Image src={searchParams.url} width={200} height={200} alt='Template Meme' className="mb-4" />
                    <form onSubmit={createMeme} className="flex flex-col gap-4 w-full">
                        {searchParams.count > 0 ? (
                            Array.from({ length: searchParams.count }).map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder={`Enter text ${index + 1}`}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            ))
                        ) : (
                            <p>No input boxes available. Please check your template settings.</p>
                        )}
                        <button type='submit' className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                            Create Meme
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>
            )}


            {isLoading && (
                <div className="flex items-center justify-center mt-4">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                </div>
            )}
        </div>
    );
}

export default CreateMeme;
