import React from "react";

function Home() {
    return (
        <div className="w-screen min-h-screen bg-gray-100 absolute top-0 left-0 right-0">
            {/* Hero Section */}
            <div className="pt-24 px-4 md:px-12 lg:px-24  ">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left Side - Icon and Description */}
                    <div className="flex-1 flex flex-col items-start space-y-8 max-w-lg xl:ml-24 2xl:ml-60 ">
                        {/* Large Icon/Logo */}
                        <div className="w-full flex justify-center ">
                            <div className="h-48 w-96 2xl:h-64 2xl:w-[28rem] bg-Logo bg-contain bg-no-repeat bg-center"/>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 text-lg md:text-xl">
                        Hai, Selamat datang di atas kota
                        selamat menikmati beberapa hidangan kami
                        </p>
                    </div>

                    {/* Right Side - Coffee Image */}
                    <div className="flex-1 flex justify-center items-center h-[600px] 0">
                        <div className="h-[340px] w-[400px] xl:h-[442px] xl:w-[520px] 2xl:h-[510px] 2xl:w-[600px] bg-Coffee bg-cover bg-center bg-no-repeat rounded-2xl"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
