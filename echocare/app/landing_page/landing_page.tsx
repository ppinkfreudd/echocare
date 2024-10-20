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
import { GoogleMap, LoadScriptNext, Marker, Autocomplete } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '300px',
  height: '300px',
};

const darkModeStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
];

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

    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
      const getUserLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }, (error) => {
            console.error("Error getting location: ", error);
          });
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };

      getUserLocation();
    }, []);

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

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.geometry && place.geometry.location) {
                setDestination({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            } else {
                console.error("Selected place does not have geometry information.");
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
              {"The most accessible food bank and shelter network.".split("").map((char, index) => (
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

        {isLoaded ? (
          <div className="absolute top-4 left-4">
            {isSignedIn ? (
              <RainbowButton onClick={handleDonateClick}>
                For Restaurants
              </RainbowButton>
            ) : (
              <SignInButton mode="modal">
                <RainbowButton>
                  For Restaurants
                </RainbowButton>
              </SignInButton>
            )}
          </div>
        ) : (
          <div className="absolute top-4 left-4">
            <RainbowButton disabled>
              Loading...
            </RainbowButton>
          </div>
        )}

        <LoadScriptNext
          googleMapsApiKey="AIzaSyCHyK3WRMnFUphAccHwVPWAjNuBUZd4sJI"
          libraries={['places']}
          loadingElement={<div>Loading...</div>}
        >
          <>
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
      

            <div className="absolute bottom-[60%] right-4 p-4 bg-slate-800 rounded-lg shadow-lg">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                  type="text"
                  placeholder="Enter a destination"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-white"
                  style={{ width: '300px' }} // Removed margin to reduce gap between input and map
                />
              </Autocomplete>
            </div>

            <div className="absolute bottom-[20%] right-4 opacity-[80%] rounded-lg shadow-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
                options={{styles: darkModeStyle}}
              >
                <Marker position={center} />
                {destination && <Marker position={destination} />}
              </GoogleMap>
            </div>
          </>
        </LoadScriptNext>
      </div>
    );
  };

export default LandingPage;
