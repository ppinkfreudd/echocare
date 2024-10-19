"use client";

import React, { useState, useEffect } from 'react';
import AbstractBall from '../components/glob';
import useVapi from '../hooks/use-vapi';
import MicButton from '../components/MicButton';
import { MicIcon, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, SignInButton } from "@clerk/nextjs";

const LandingPage: React.FC = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const { volumeLevel, isSessionActive, toggleCall } = useVapi();
    const [config, setConfig] = useState({
      perlinTime: 50.0,
      perlinDNoise: 2.5,
      chromaRGBr: 7.5,
      chromaRGBg: 5,
      chromaRGBb: 7,
      chromaRGBn: 0,
      chromaRGBm: 1.0,
      sphereWireframe: false,
      spherePoints: false,
      spherePsize: 1.0,
      cameraSpeedY: 0.0,
      cameraSpeedX: 0.0,
      cameraZoom: 175,
      cameraGuide: false,
      perlinMorph: 5.5,
    });
   
    useEffect(() => {
      if (isSessionActive && volumeLevel > 0) {
        setConfig(prevConfig => ({
          ...prevConfig,
          perlinTime: 100.0,
          perlinMorph: 25.0,
        }));
      } 
      else{ 
        if (isSessionActive) {
          setConfig(prevConfig => ({
            ...prevConfig,
            perlinTime: 25.0,
            perlinMorph: 10.0,
          }));
        }
        else{
        setConfig(prevConfig => ({
          ...prevConfig,
          perlinTime: 5.0,
          perlinMorph: 0,
        }));
        }
      }
    }, [isSessionActive, volumeLevel]);

    const handleDonateClick = () => {
      if (!isLoaded) {
        // Authentication is still loading, you might want to show a loading spinner here
        return;
      }

      if (isSignedIn) {
        // User is authenticated, navigate to the donation page
        router.push('/businesspage_side/business_page');
      }
      // If not signed in, the SignInButton will handle the sign-in process
    };
   
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <AbstractBall {...config} />
        <div className="flex justify-center mt-4">
        <MicButton onClick={toggleCall} className='m-2'>
          {isSessionActive ? <PhoneOff size={18} /> : <MicIcon size={18} />}
        </MicButton>
        </div>
        {isLoaded && (
          isSignedIn ? (
            <button 
              className='absolute top-0 left-0 bg-blue-500 text-white p-2 rounded-md'
              onClick={handleDonateClick}
            >
              Donate Food
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
