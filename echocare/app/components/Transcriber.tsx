"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useVapi from '../hooks/use-vapi';

interface Message {
  role: string;
  text: string;
}

interface TranscriberProps {
  conversation: Message[];
}

const Transcriber: React.FC<TranscriberProps> = ({ conversation }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getDirections, getCurrentLocation } = useVapi();
  const [mapUrl, setMapUrl] = useState<string | null>(null); // To store the dynamic map URL
  const [directionsText, setDirectionsText] = useState<string[]>([]); // To display step-by-step directions

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const renderWords = (text: string | JSX.Element[]) => {
    if (typeof text === 'string') {
      const words = text.split(' ');
      return (
        <div className="inline-block">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="inline-block mr-1"
            >
              {word}
            </motion.span>
          ))}
        </div>
      );
    } else {
      return <div className="inline-block">{text}</div>;
    }
  };

  const groupedConversation = conversation.reduce((acc, message) => {
    const lastMessage = acc[acc.length - 1];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (lastMessage && lastMessage.role === message.role) {
      const combinedText = lastMessage.text + ' ' + message.text;
      const parts = combinedText.split(urlRegex);
      lastMessage.text = parts.map((part, index) =>
        urlRegex.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : part
      );
    } else {
      const parts = message.text.split(urlRegex);
      acc.push({
        role: message.role,
        text: parts.map((part, index) =>
          urlRegex.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : part
        ),
      });
    }
    return acc;
  }, [] as Message[]);

  const handleGetDirections = async (destination: string) => {
    const origin = await getCurrentLocation();
    if (origin) {
      const directions = await getDirections(origin, destination);
      if (directions) {
        const { distance, duration, steps } = directions;

        // Generate the map URL
        const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyCHyK3WRMnFUphAccHwVPWAjNuBUZd4sJI
        &origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving`;
        setMapUrl(mapUrl); // Set the map URL to embed the map

        // Update the directions text
        setDirectionsText([`Distance: ${distance}`, `Duration: ${duration}`, ...steps]);
      } else {
        setDirectionsText(["Sorry, I couldn't find directions to the destination."]);
      }
    } else {
      setDirectionsText(["Sorry, I couldn't access your current location."]);
    }
  };

  return (
    <div ref={scrollRef} className="h-60 overflow-y-auto p-4 bg-slate-700 rounded-lg">
      {conversation.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          {message.role === 'system' ? (
            message.text.startsWith("User's current location:") ? (
              <i>
                Your current location: {message.text.replace("User's current location:", '')}
              </i>
            ) : (
              <i>{message.text}</i>
            )
          ) : (
            <>{message.text}</>
          )}
        </div>
      ))}


      {/* Conditionally render the map if mapUrl is available */}
      {mapUrl && (
        <div className="mt-4">
          <iframe
            title="Map"
            src={mapUrl}
            width="100%"
            height="300"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}

      {/* Display step-by-step directions */}
      {directionsText.length > 0 && (
        <div className="mt-4 p-2 bg-white border rounded">
          <h3 className="font-bold mb-2">Directions:</h3>
          {directionsText.map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transcriber;
