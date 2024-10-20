"use client";
import React, { useState, useRef, useEffect } from 'react';
import AbstractBall from '../components/glob';
import Transcriber from '../components/Transcriber';
import useVapi from '../hooks/use-vapi';
import MicButton from '../components/MicButton';
import { MicIcon, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth, SignInButton } from "@clerk/nextjs";
import { identifyFoodSafety } from '../components/gemini-food-vision';  
import Ripple from '../components/ui/Ripple';
import RainbowButton from '../components/ui/RainbowButton';

const LandingPage: React.FC = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const { volumeLevel, isSessionActive, conversation, toggleCall } = useVapi();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [foodSafetyResult, setFoodSafetyResult] = useState<string | null>(null);
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
      if (isSignedIn) {
        router.push('/businesspage_side');
      }
    };

    const handleIdentifyFoodSafety = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          setFoodSafetyResult("Analyzing image...");
          const result = await identifyFoodSafety(file);
          setFoodSafetyResult(result);
        } catch (error) {
          console.error('Error identifying food safety:', error);
          setFoodSafetyResult('An error occurred while analyzing the image.');
        }
      }
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
            <h1 className="mt-10 text-6xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text">
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
            <p className="text-xl text-white">
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
        <div className='mt-[-30px] relative'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <AbstractBall {...config} className='z-10'/>
          </motion.div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 pointer-events-auto">
            <div className="bg-blue-500 rounded-full animate-pulse p-2 mt-[-60px] w-10 h-10">
              <MicButton onClick={toggleCall}>
                {isSessionActive ? <PhoneOff size={22} /> : <MicIcon size={22} />}
              </MicButton>
            </div>
          </div>
        </div>
        <Ripple />
 
        <Transcriber conversation={conversation} />

        {isLoaded && (
          <div className="absolute top-4 left-4">
            {isSignedIn ? (
              <RainbowButton onClick={handleDonateClick}>
                For Restaurants
              </RainbowButton>
            ) : (
              <SignInButton mode="modal" afterSignInUrl="/businesspage_side">
                <RainbowButton>
                  For Restaurants
                </RainbowButton>
              </SignInButton>
            )}
          </div>
        )}

        <div className="absolute top-4 right-4">
          <RainbowButton onClick={handleIdentifyFoodSafety}>
            A.I. Food Safety Check
          </RainbowButton>
          <input 
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {foodSafetyResult && (
          <div className="absolute bottom-4 left-4 right-4 bg-white text-black p-4 rounded-md max-h-60 overflow-y-auto">
            <h3 className="font-bold mb-2">Food Safety Analysis:</h3>
            <p>{foodSafetyResult}</p>
          </div>
        )}
      </div>
    );
  };

export default LandingPage;
