import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const MapComponent = () => {
    const mapContainer = useRef(null);
    const [coordinates, setCoordinates] = useState<[number, number]>([6.471211177998569, 3.199952782857913]);
  
    const apiKey = import.meta.env.VITE_MAPBOX_TOKEN; 
    const getMapStyle = async () => {
      if (!apiKey) {
        toast.error('Mapbox API key is missing!');
        return;
      }
      return 'mapbox://styles/mapbox/streets-v12'; // Only use the style ID here
    };
  
  
    mapboxgl.accessToken = apiKey as unknown as string;
    useEffect(() => {
      const getCurrentLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCoordinates([longitude, latitude]);
            },
            () => {
              toast.error('Error getting location');
              setCoordinates([6.471211177998569, 3.199952782857913]);
            }
          );
        } else {
          toast.error('Geolocation is not supported by this browser.');
          setCoordinates([6.471211177998569, 3.199952782857913]);
        }
      };
  
      getCurrentLocation();
  
      const initializeMap = async () => {
        const mapStyle = await getMapStyle();
        if (!mapStyle) return;  // Don't initialize map if there's an error
  
        const map = new mapboxgl.Map({
          container: mapContainer.current as any,
          style: mapStyle,  // Use the style ID here
          center: coordinates,  // Coordinates are now correctly typed as [number, number]
          zoom: 14,
        });
  
        map.on('load', () => {
          toast.info('Map loaded successfully');
        });
  
        return () => {
          map.remove();
        };
      };
  
      initializeMap();
    }, [coordinates]);

  return <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />;
};

export default MapComponent;
