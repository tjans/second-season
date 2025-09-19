import { useState, useEffect } from 'react'
import { Outlet, Link } from "react-router-dom";
import useAppStore from "@/stores/useAppStore";
import { APP_NAME, getHeaderStyles } from "@/config/app";
import Loading from "@/components/Loading";

// Icons
import { FaKey, FaSignOutAlt, FaHome } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { AiFillControl } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";



// Other
import { ToastContainer, Slide } from "react-toastify";
import ScrollToTop from "@/components/ScrollToTop";
import AppBootstrap from "@/components/app/AppBootstrap";
import React from 'react';
//import useAuthReady from '@/hooks/useAuthReady';

export default function Layout() {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const appStore = useAppStore();
  //const { isReady } = useAuthReady();
  const isReady = true; // Temporary until auth is implemented

  useEffect(() => {
    document.title = `${pageTitle ? `${pageTitle} | ` : ""}${APP_NAME}`;
  }, [pageTitle]);

  return (
    <>
      {/* Always mount bootstrap and scroll logic */}
      <AppBootstrap />
      <ScrollToTop />

      {!isReady ? (
        <Loading />
      ) : (
        <>
          <div 
            className="flex items-center justify-center gap-3 p-4 font-bold text-center shadow shadow-slate-400"
            style={getHeaderStyles()}
          >
            {APP_NAME}
          </div>

          <div className="m-2">
            {/* {appStore?.auth?.userName
              ? <span>Hello, <strong>{appStore.auth.userName}!</strong></span>
              : <div>Welcome, <strong>guest</strong>!</div>
            } */}

            <div>
              {appStore?.auth?.roles?.map((role, index) => (
                <span key={index} className="px-2 py-1 mr-1 text-sm font-bold text-white bg-blue-500 rounded-sm">
                  {typeof role === 'string' ? role : role.Name}
                </span>
              ))}
            </div>

          </div>

          <div className="h-screen mx-auto text-center">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Outlet context={[setPageTitle]} />
          </React.Suspense>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-300">
            <div className="flex justify-around p-4">
              <Link className="flex flex-col items-center text-sm text-gray-600 hover:text-gray-800" to="/">
                <FaHome className="text-2xl font-bold" />
                <span>Home</span>
              </Link>

              {/* {!appStore?.auth?.accessToken &&
                <Link className="flex flex-col items-center text-sm text-gray-600 hover:text-gray-800" to="/login">
                  <FaKey className="text-2xl font-bold" />
                  <span>Login</span>
                </Link>
              } */}

              {/* <Link className="flex flex-col items-center text-sm text-gray-600 hover:text-gray-800" to="/profile">
                <MdAccountCircle className="text-2xl font-bold" />
                <span>Profile</span>
              </Link> */}

              <Link className="flex flex-col items-center text-sm text-gray-600 hover:text-gray-800" to="/members">
                <IoPeople className="text-2xl font-bold" />
                <span>Styles</span>
              </Link>

              {/* <Link className="flex flex-col items-center text-sm text-gray-600 hover:text-gray-800" to="/control-panel">
                <AiFillControl className="text-2xl font-bold" />
                <span>Control Panel</span>
              </Link>

              {appStore?.auth?.accessToken &&
                <Link to="/logout" className="flex flex-col items-center text-sm text-gray-600 hover:text-gray-800">
                  <FaSignOutAlt className="text-2xl font-bold" />
                  <span>Log Out</span>
                </Link>
              } */}
            </div>
          </div>
        </>
      )}

      <ToastContainer
        closeButton={true}
        position="top-center"
        theme="colored"
        autoClose={1500}
        transition={Slide}
        closeOnClick={true}
      />
    </>
  );
}
