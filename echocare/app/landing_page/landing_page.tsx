"use client";
import React, { useState, useEffect } from 'react';
import AbstractBall from '../components/glob';
import Transcriber from '../components/Transcriber';
import useVapi from '../hooks/use-vapi';
import MicButton from '../components/MicButton';
import { MicIcon, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth, SignInButton } from "@clerk/nextjs";

const LandingPage: React.FC = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const { volumeLevel, isSessionActive, conversation, toggleCall } = useVapi();
    const [config, setConfig] = useState({
      perlinTime: 50.0,
      perlinDNoise: 1.0,
      chromaRGBr: 7.5,
      chromaRGBg: 5,
      chromaRGBb: 7,
      chromaRGBn: 0,
      chromaRGBm: 1.0,
      sphereWireframe: false,
      spherePoints: false,
      spherePsize: 0.1,
      cameraSpeedY: 0.0,
      cameraSpeedX: 0.0,
      cameraZoom: 175,
      cameraGuide: false,
      perlinMorph: 5.5,
    });

    useEffect(() => {
      if (isSessionActive) {
        setConfig(prevConfig => ({
          ...prevConfig,
          perlinTime: 100.0,
          perlinMorph: 25.0,
        }));
      } else {
        setConfig(prevConfig => ({
          ...prevConfig,
          perlinTime: 5.0,
          perlinMorph: 0,
        }));
      }
    }, [isSessionActive]);

    const handleDonateClick = () => {
      if (!isLoaded) {
        // Authentication is still loading, you might want to show a loading spinner here
        return;
      }

      if (isSignedIn) {
        // User is authenticated, navigate to the donation page
        router.push('/businesspage_side');
      }
      // If not signed in, the SignInButton will handle the sign-in process
    };

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <header className="w-full flex justify-center items-center h-1/4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-black mb-4">
              {"Welcome to EchoCare".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
            <p className="text-xl text-black">
              {"The most accessible food bank network.".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  {char}
                </motion.span>
              ))}
              <br />
              {"Speak with Echo below to find help near you.".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  {char}
                </motion.span>
              ))}
            </p>
          </motion.div>
        </header>
        <AbstractBall {...config} />
        <div className="flex justify-center mt-4">
          <MicButton onClick={toggleCall} className='m-2'>
            {isSessionActive ? <PhoneOff size={18} /> : <MicIcon size={18} />}
          </MicButton>
        </div>

        <Transcriber conversation={conversation} />

        {isLoaded && (
          isSignedIn ? (
            <button
              className='absolute top-0 left-0 bg-blue-500 text-white p-2 rounded-md'
              onClick={handleDonateClick}
            >
              Restaurants, End Food Waste. Donate Food Now.
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className='absolute top-0 left-0 bg-blue-500 text-white p-2 rounded-md'>
                Donate Food
              </button>
            </SignInButton>
          )
        )}
      </div>
    );
  };

  export default LandingPage;
