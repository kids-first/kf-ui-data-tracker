import React from 'react';

const Onboard = () => (
    <div className="flex flex-row-reverse overflow-hidden h-screen">
        <div className="flex-grow z-10">
            <div className="h-full relative -left-24">
                <svg
                    className="sm:hidden lg:block absolute left-0 inset-y-0 h-full w-64 text-white transform -translate-x-1/4"
                    fill="currentColor"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <polygon points="15,0 100,0 100,100 0,100" />
                </svg>
                <main className="relative max-w-7xl mx-auto py-16 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl">
                        Page Title
                    </h2>
                    <p className="mt-6 text-xl text-gray-700 max-w-3xl">
                        Mattis amet hendrerit dolor, quisque lorem pharetra.
                        Pellentesque lacus nisi urna, arcu sociis eu. Orci vel
                        lectus nisl eget eget ut consectetur. Sit justo viverra
                        non adipisicing elit distinctio.
                    </p>
                </main>
            </div>
            <div
                className="absolute -bottom-1/3 -right-1/4 w-1/2 h-1/2 transform rotate-45"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23fde68a' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            ></div>
        </div>

        <div className="relative w-96 h-full">
            <h1 className="absolute top-0 left-0 z-10 text-black text-4xl font-extrabold tracking-tight">
                Operations Hub
            </h1>
            <img
                className="absolute top-0 h-full object-cover"
                src="https://images.unsplash.com/photo-1608249887976-3e564514024f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=20"
                alt="Sidebar"
            />
        </div>
    </div>
);

export default Onboard;
