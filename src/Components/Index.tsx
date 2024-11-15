import { useState, useEffect, useRef } from "react";
import {
  BiDetail,
  BiLayer,
  BiRocket,
  BiSearch,
  BiSolidDetail,
  BiStreetView,
} from "react-icons/bi";
import lasuLogo from "./../assets/lasu.jpg";
import { HiLocationMarker } from "react-icons/hi";
import { BsPersonWalking } from "react-icons/bs";
import { IoBicycle, IoCar } from "react-icons/io5";
import mapboxgl from "mapbox-gl";
import { toast } from "react-toastify";

const Index = () => {
  interface locationInterface {
    name?: string;
    lat?: number;
    lng?: number;
  }

  const [travelMethod, setTravelMethod] = useState<
    "walking" | "driving" | "cycling"
  >("walking");
  const [showTravelMethod, setShowTravelMehtod] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<locationInterface>(
    null as unknown as locationInterface
  );
  const [selectedLocation, setSelectedLocation] = useState<locationInterface>({
    name: "science Complex",
    lat: 6.466362124948927,
    lng: 3.2003106126389302,
  });
  const [showPlaces, setShowPlaces] = useState<boolean>(false);
  const [streetView, setStreetView] = useState<"normal" | "detailed">(
    "detailed"
  );

  // Watch user's location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(newLocation);
    });

    return () => navigator.geolocation.clearWatch(watchId); // Clear watcher on cleanup
  }, []);

  const locations: locationInterface[] = [
    { name: "Burba Marwa", lat: 6.4731069928423395, lng: 3.2015184369190073 },
    { name: "Senate Building", lat: 6.471211177998569, lng: 3.199952782857913 },
    { name: "Love Garden", lat: 6.4694481147419935, lng: 3.2005249640922355 },
    { name: "MBA Hall", lat: 6.468575691226138, lng: 3.200324757622563 },
    {
      name: "Flavours Canteen",
      lat: 6.468154913556658,
      lng: 3.201685524467273,
    },
    { name: "Benson Hall", lat: 6.467896062119851, lng: 3.200226188222441 },
    { name: "Old Science", lat: 6.467215378074746, lng: 3.2000452787614426 },
    {
      name: "science Complex",
      lat: 6.466362124948927,
      lng: 3.2003106126389302,
    },
    {
      name: "Sport center first entrance",
      lat: 6.469800311247251,
      lng: 3.202523699291918,
    },
    {
      name: "Sport center second entrance",
      lat: 6.466843547335182,
      lng: 3.2024997035699094,
    },
    { name: "Health center", lat: 6.465454895916116, lng: 3.2016988200414525 },
    {
      name: "Major banks on campus",
      lat: 6.464873968992507,
      lng: 3.2039533071543995,
    },
    { name: "Admin Block", lat: 6.464913758510681, lng: 3.1998167437588068 },
    { name: "Mosque", lat: 6.465494685388579, lng: 3.199896832110954 },
    { name: "Chapel", lat: 6.465088832434565, lng: 3.1989557939732234 },
    { name: "Hardware Lab", lat: 6.464380578459994, lng: 3.1997646863299116 },
    { name: "Physics lab", lat: 6.464659105424986, lng: 3.201346431291005 },
    { name: "Lasu Radio", lat: 6.471160095540121, lng: 3.199978753621533 },
    {
      name: "3-in-1 Education",
      lat: 36.473043068903322,
      lng: 3.1998925644167424,
    },
    { name: "CBT Center", lat: 6.4750885979536905, lng: 3.2012627829273184 },
    { name: "FMS Toilet", lat: 6.476145902669435, lng: 3.2000881539430672 },
    { name: "Shuttle Park", lat: 6.4744899307684705, lng: 3.1994713263368983 },
    {
      name: "Chief Sl.Edu Hall",
      lat: 6.46803944077853,
      lng: 3.1999941167956716,
    },
    { name: "Makanjuola Hall", lat: 6.466128, lng: 3.2013806 },
    { name: "Library", lat: 6.464858120817215, lng: 3.20065026876411 },
    { name: "Book shop", lat: 6.464992323883617, lng: 3.200339698553843 },
    // { name: "Library", lat: 37.7848, lng: -122.4094 },
  ];

  const handleInDivTravelMethodClick = (e: any) => {
    e.stopPropagation();
  };

  const closeTravelMethod = (e: any) => {
    setShowTravelMehtod(false);
    e.stopPropagation();
  };

  const closePlaces = (e: any) => {
    setShowPlaces(false);
    e.stopPropagation();
  };

  const updateLocation = (e: any) => {
    setSelectedLocation(e.target.dataset.location);
  };

  const mapContainer = useRef(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([
    6.471211177998569, 3.199952782857913,
  ]);
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates([longitude, latitude]);
          },
          () => {
            toast.error("Error getting location");
            setCoordinates([6.471211177998569, 3.199952782857913]);
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
        setCoordinates([6.471211177998569, 3.199952782857913]);
      }
    };

    getCurrentLocation();

    const apiKey = import.meta.env.VITE_MAPBOX_TOKEN;
    const getMapStyle = async () => {
      if (!apiKey) {
        toast.error("Credentials missing!");
        return;
      }
      // return 'mapbox://styles/mapbox/streets-v12';
      // mapbox://styles/mapbox/streets-v11
      return streetView == "detailed"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/streets-v12";
    };

    mapboxgl.accessToken = apiKey as unknown as string;

    const initializeMap = async () => {
      const mapStyle = await getMapStyle();
      if (!mapStyle) return; // Don't initialize map if there's an error

      const map = new mapboxgl.Map({
        container: mapContainer.current as any,
        style: mapStyle, // Use the style ID here
        center: coordinates, // Coordinates are now correctly typed as [number, number]
        zoom: 17,
        maxZoom: 30,
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // const { latitude, longitude } = position.coords;
          let location = {
            lng: 6.471211177998569,
            lat: 3.199952782857913,
          };
          setUserLocation(location); // Save user location

          // Center the map to user's location
          map.flyTo({
            center: [location.lat, location.lng],
            zoom: 13,
          });
        },
        () => {
          toast.error("Error getting location");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      map.addControl(new mapboxgl.NavigationControl());

      if (userLocation) {
        // Example: Empire State Building

        // Fetch directions from Mapbox API
        const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/${travelMethod}/${userLocation.lng},${userLocation.lat};${selectedLocation.lng},${selectedLocation.lat}?geometries=geojson&access_token=${apiKey}`;

        fetch(routeUrl)
          .then((response) => response.json())
          .then((data) => {
            const route = data.routes[0].geometry;

            // Add the route as a GeoJSON source
            map.on("load", () => {
              // Remove existing route layer if present
              if (map.getLayer("route")) {
                map.removeLayer("route");
                map.removeSource("route");
              }

              // Add GeoJSON source with the route geometry and empty properties
              map.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: route,
                  properties: {}, // Add an empty properties object to satisfy the GeoJSON structure
                },
              });

              // map.addLayer({
              //   id: '3d-buildings',
              //   source: 'composite',
              //   'source-layer': 'building',
              //   type: 'fill-extrusion',
              //   paint: {
              //     'fill-extrusion-color': '#aaa',
              //     'fill-extrusion-height': ['get', 'height'],
              //     'fill-extrusion-base': ['get', 'min_height'],
              //     'fill-extrusion-opacity': 0.6,
              //   },
              // });

              // Add a layer to display the route
              map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                paint: {
                  "line-color": "#007cbf",
                  "line-width": 5,
                },
              });
            });
          })
          .catch((error) => {
            console.error("Error fetching directions:", error);
          });
      }

      locations.forEach((location: locationInterface) => {
        // Create a marker for each location
        const marker = new mapboxgl.Marker()
          .setLngLat([location.lng as any, location.lat as any])
          .addTo(map);

        // Create a custom HTML element for the label
        const label = document.createElement("div");
        label.className = "map-label" as any;
        label.innerText = location.name as any;

        // Use custom labels next to the markers
        new mapboxgl.Marker(label)
          .setLngLat([location.lng as any, location.lat as any])
          .addTo(map);

        // Add a popup with the name of the location
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          location.name as any
        );
        marker.setPopup(popup);
      });

      return () => {
        map.remove();
      };
    };
    initializeMap();
  }, [travelMethod, selectedLocation, streetView]);

  return (
    <>
      <div className={`fixed top-0 bottom-0 left-0 right-0 bg-gray-50`}>
        <div
          className={`w-full m-0 shadow-lg h-20 flex flex-row items-center gap-x-3 justify-between`}
        >
          <div className={`flex flex-row items-center`}>
            <img
              src={lasuLogo}
              className={`bg-center bg-no-repeat bg-cover w-14 h-14 mx-2`}
            ></img>
            <form
              className={`flex flex-row px-3 rounded-2xl ml-5 border-b border-gray-400`}
            >
              <input
                type="text"
                className={`bg-transparent text-gray-500 font-light p-2 focus:outline-none flex-grow md:w-64`}
                placeholder="search..."
              />
              <button
                className={`w-16 h-16 rounded-full text-gray-600 flex items-center justify-center bg-gray-50 hover:border-transparent`}
              >
                <BiSearch
                  className={`font-light text-gray-600 text-3xl`}
                ></BiSearch>
              </button>
            </form>
            <div className="flex flex-col fixed bottom-5 right-5 z-50 shadow-lg p-2 rounded-3xl border border-gray-500 bg-gray-50 justify-center items-center md:shadow-none md:static md:rounded-none md:border-none md:flex-row md:bg-transparent">
              <button
                className={`w-16 h-16 rounded-full text-gray-600 flex items-center justify-center bg-gray-50 hover:border-transparent hover:bg-gray-200 ml-2`}
                title="Switch street view"
              >
                {streetView == "normal" ? (
                  <BiLayer
                    className={`font-light text-gray-600 text-3xl`}
                    onClick={() => {
                      setStreetView("detailed");
                    }}
                  ></BiLayer>
                ) : (
                  <BiStreetView
                    className={`font-light text-gray-600 text-3xl`}
                    onClick={() => {
                      setStreetView("normal");
                    }}
                  ></BiStreetView>
                )}
              </button>
              <button
                className={`w-16 h-16 rounded-full text-gray-600 flex items-center justify-center bg-gray-50 hover:border-transparent hover:bg-gray-200 ml-2`}
                title="Find a place"
              >
                <HiLocationMarker
                  className={`font-light text-gray-600 text-3xl`}
                  onClick={() => {
                    setShowPlaces(true);
                  }}
                ></HiLocationMarker>
              </button>
              <button
                className={`w-16 h-16 rounded-full text-gray-600 flex items-center justify-center bg-gray-50 hover:border-transparent hover:bg-gray-200`}
                onClick={() => {
                  setShowTravelMehtod(true);
                }}
              >
                {travelMethod == "walking" && (
                  <BsPersonWalking
                    className={`font-light text-gray-600 text-3xl`}
                  ></BsPersonWalking>
                )}
                {travelMethod == "cycling" && (
                  <IoBicycle
                    className={`font-light text-gray-600 text-3xl`}
                  ></IoBicycle>
                )}
                {travelMethod == "driving" && (
                  <IoCar
                    className={`font-light text-gray-600 text-3xl`}
                  ></IoCar>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-full">
          <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
        </div>
      </div>

      {showTravelMethod && (
        <div
          className={`fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-70`}
          onClick={closeTravelMethod}
        >
          <div
            className={`p-5 bg-gray-50 rounded-3xl flex flex-col w-11/12 md:w-1/2 shadow-lg`}
            onClick={handleInDivTravelMethodClick}
          >
            <div
              className={`flex flex-row justify-between items-center text-2xl p-3 cursor-pointer hover:bg-gray-200 rounded-2xl py-6`}
              onClick={() => {
                setTravelMethod("walking");
                setShowTravelMehtod(false);
              }}
            >
              <h3 className={`text-gray-600 font-light`}>Walking</h3>
              <input
                type="radio"
                name="travel_method"
                id=""
                className={`w-8 h-8 accent-blue-700 bg-transparent border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 travel_radio`}
                checked={travelMethod == "walking"}
              />
            </div>
            <div
              className={`flex flex-row justify-between items-center text-2xl p-3 cursor-pointer hover:bg-gray-200 rounded-2xl py-6`}
              onClick={() => {
                setTravelMethod("driving");
                setShowTravelMehtod(false);
              }}
            >
              <h3 className={`text-gray-600 font-light`}>driving</h3>
              <input
                type="radio"
                name="travel_method"
                id=""
                className={`w-8 h-8 accent-blue-700 bg-transparent border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 travel_radio`}
                checked={travelMethod == "driving"}
              />
            </div>
            <div
              className={`flex flex-row justify-between items-center text-2xl p-3 cursor-pointer hover:bg-gray-200 rounded-2xl py-6`}
              onClick={() => {
                setTravelMethod("cycling");
                setShowTravelMehtod(false);
              }}
            >
              <h3 className={`text-gray-600 font-light`}>cycling</h3>
              <input
                type="radio"
                name="travel_method"
                id=""
                className={`w-8 h-8 accent-blue-700 bg-transparent border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 travel_radio`}
                checked={travelMethod == "cycling"}
              />
            </div>
          </div>
        </div>
      )}

      {showPlaces && (
        <div
          className={`fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-70`}
          onClick={closePlaces}
        >
          <div
            className={`p-5 bg-gray-50 rounded-3xl flex flex-col w-11/12 md:w-1/2 shadow-lg h-5/6 overflow-y-auto`}
            onClick={handleInDivTravelMethodClick}
          >
            <h3 className="text-gray-700 font-light text-3xl mb-5 text-center">
              Places on Campus
            </h3>
            {locations.map((location: locationInterface, index: number) => (
              <div
                className={`flex flex-row justify-between items-center text-2xl p-3 cursor-pointer hover:bg-gray-200 rounded-2xl py-6`}
                data-location={location}
                onClick={() => {
                  updateLocation;
                  setShowPlaces(false);
                }}
                key={index}
              >
                <div className={`flex flex-row`}>
                  <HiLocationMarker className="font-light text-gray-600 text-3xl mr-5"></HiLocationMarker>
                  <h3 className={`text-gray-600 font-light`}>
                    {location.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
