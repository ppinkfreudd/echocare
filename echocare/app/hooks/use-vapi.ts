import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import axios from 'axios';

const publicKey = '2d89a8ef-c549-475f-a2ad-0ff6e65d1689'; // Replace with your actual public key
const assistantId = 'd285585d-7597-48cb-ab5e-4b2ef9597e1e'; // Replace with your actual assistant ID

const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversation, setConversation] = useState<{ role: string, text: string }[]>([]);
  const vapiRef = useRef<any>(null);

  const initializeVapi = useCallback(() => {
    if (!vapiRef.current) {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;

      vapiInstance.on('call-start', async () => {
        setIsSessionActive(true);
        
        // Get the current location when the call starts
        const currentLocation = await getCurrentLocation();
        let locationMessage = "Unable to get location.";
        if (currentLocation) {
          const address = await reverseGeocode(currentLocation);
          if (address) {
            locationMessage = `User's current location: ${address}`;
            
            // Send the current address to the Vapi conversation
            vapiInstance.send({
              type: "add-message",
              message: {
                role: 'system',
                content: locationMessage
              }
            });

            setConversation((prev) => [
              ...prev,
              { role: 'system', text: locationMessage },
            ]);

            // Query Google Places API to find suitable places nearby
            const nearbyPlaces = await findNearbyPlaces(currentLocation);
            if (nearbyPlaces && nearbyPlaces.length > 0) {
              // Send the nearby places to the Vapi conversation
              vapiInstance.send({
                type: "add-message",
                message: {
                  role: 'system',
                  content: `Nearby places: ${nearbyPlaces.join(', ')}`
                }
              });
              
              setConversation((prev) => [
                ...prev,
                { role: 'system', text: `Nearby places: ${nearbyPlaces.join(', ')}` },
              ]);
            }
          }
        }

        // Send location to Vapi conversation
        vapiInstance.send({
          type: "add-message",
          message: {
            role: 'system',
            content: locationMessage
          }
        });

        setConversation((prev) => [
          ...prev,
          { role: 'system', text: locationMessage },
        ]);
      });

      vapiInstance.on('call-end', () => {
        setIsSessionActive(false);
        setConversation([]); // Reset conversation on call end
      });

      vapiInstance.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          setConversation((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      });

      vapiInstance.on('error', (e: Error) => {
        console.error('Vapi error:', e);
      });
    }
  }, []);

  useEffect(() => {
    initializeVapi();

    // Cleanup function to end call and dispose Vapi instance
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);

  const toggleCall = async () => {
    try {
      if (isSessionActive) {
        await vapiRef.current.stop();
      } else {
        await vapiRef.current.start(assistantId);
      }
    } catch (err) {
      console.error('Error toggling Vapi session:', err);
    }
  };

  // Helper function to get place details
  const getPlaceCoordinates = async (placeName: string): Promise<string | null> => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
          placeName
        )}&inputtype=textquery&fields=geometry&key=${'AIzaSyCHyK3WRMnFUphAccHwVPWAjNuBUZd4sJI'}`
      );

      if (response.data.candidates.length > 0) {
        const location = response.data.candidates[0].geometry.location;
        return `${location.lat},${location.lng}`; // Return latitude and longitude as a string
      } else {
        console.error('Place not found');
        return null;
      }
    } catch (error) {
      console.error('Error finding place:', error);
      return null;
    }
  };

  const getDirections = async (origin: string, destination: string) => {
    try {
      // First, attempt to get the coordinates for the destination place
      const destinationCoords = await getPlaceCoordinates(destination);
      if (!destinationCoords) {
        console.error('Could not find the destination');
        return null;
      }

      // Now, use the Directions API to get directions from the origin to the destination
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
          origin
        )}&destination=${destinationCoords}&key=${'AIzaSyCHyK3WRMnFUphAccHwVPWAjNuBUZd4sJI'}`
      );

      const directions = response.data.routes[0].legs[0];
      const distance = directions.distance.text;
      const duration = directions.duration.text;
      const steps = directions.steps.map((step: any) => step.html_instructions);

      // Construct the Google Maps URL with the origin and destination
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}`;

      // Open the Google Maps URL in a new tab or window
      window.open(googleMapsUrl, '_blank');

      return { distance, duration, steps };
    } catch (error) {
      console.error('Error fetching directions:', error);
      return null;
    }
  };

  const getCurrentLocation = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude},${longitude}`);
          },
          (error) => {
            console.error('Error getting current location:', error);
            resolve(null);
          }
        );
      } else {
        console.error('Geolocation is not supported');
        resolve(null);
      }
    });
  };

  const reverseGeocode = async (coordinates: string): Promise<string | null> => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates}&key=${'AIzaSyCHyK3WRMnFUphAccHwVPWAjNuBUZd4sJI'}`
      );

      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        console.error('Address not found');
        return null;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  };

  const findNearbyPlaces = async (location: string): Promise<string[] | null> => {
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchNearby',
        {
          includedTypes: ['community_center'],
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: {
                latitude: parseFloat(location.split(',')[0]),
                longitude: parseFloat(location.split(',')[1]),
              },
              radius: 500.0,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyCHyK3WRMnFUphAccHwVPWAjNuBUZd4sJI',
            'X-Goog-FieldMask': 'places.displayName',
          },
        }
      );

      console.log('Nearby places response:', response.data); // Log the response data

      if (response.data.places && response.data.places.length > 0) {
        const placeNames = response.data.places.map((place: any) => place.displayName.text);
        return placeNames;
      } else {
        console.error('No nearby places found');
        return null;
      }
    } catch (error) {
      console.error('Error finding nearby places:', error);
      return null;
    }
  };

  return { volumeLevel, isSessionActive, conversation, toggleCall, getDirections, getCurrentLocation };
};

export default useVapi;
