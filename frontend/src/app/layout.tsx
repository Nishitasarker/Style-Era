import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import ReactQueryProvider from '../providers/ReactQueryProvider';

import { AuthProvider } from '../providers/AuthProvider';

import ConditionalNavbar from '../components/ConditionalNavbar';

import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const geistSans = Geist({

  variable: '--font-geist-sans',

  subsets: ['latin'],

});



const geistMono = Geist_Mono({

  variable: '--font-geist-mono',

  subsets: ['latin'],

});



export const metadata: Metadata = {

  title: 'Style Era | AI Female Fashion Style Advisor & Recommendations',

  description: 'Premium Agentic AI female fashion advisory platform. Personalized styles, matching outfit curations, and catalog coordinates for all ages (child, youth, elderly).',

  keywords: 'fashion advisor, female styling, AI fashion, clothes coordinator, premium outfit recommend',

};



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html

      lang="en"

      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}

    >

      <body className="min-h-full flex flex-col bg-[#0b0f19] text-white">

        <ReactQueryProvider>

          <AuthProvider>

            <ConditionalNavbar />

            <main className="flex-grow flex flex-col">

              {children}

            </main>

            <Footer />

             <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="dark"
            />

          </AuthProvider>

        </ReactQueryProvider>

      </body>

    </html>

  );

}