import { useState, useEffect, useRef } from "react";
import { BiLayer, BiSearch, BiStreetView } from "react-icons/bi";
import lasuLogo from "./../assets/lasu.jpg";
import { HiLocationMarker } from "react-icons/hi";
import { BsPersonWalking } from "react-icons/bs";
import { IoBicycle, IoCar } from "react-icons/io5";
import mapboxgl, { Marker } from "mapbox-gl";
import { toast } from "react-toastify";
import Lottie from "react-lottie";
import walkingPerson from "./../animations/walking.json";
import cyclingPerson from "./../animations/cycling.json";
import driving from "./../animations/driving.json";
import mapAnimation from "./../animations/map.json";
import {Fade} from 'react-awesome-reveal';

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
  const [userLocation, setUserLocation] = useState<locationInterface>({
    name: "user def location",
    lat: 6.466362124948927,
    lng: 3.2003106126389302,
  });
  const [selectedLocation, setSelectedLocation] = useState<locationInterface>({
    name: "science Complex",
    lat: 6.466362124948927,
    lng: 3.2003106126389302,
  });

  const [showPlaces, setShowPlaces] = useState<boolean>(false);
  const [streetView, setStreetView] = useState<"normal" | "detailed">(
    "detailed"
  );
  const [coordinates, setCoordinates] = useState<[number, number]>([
    6.471211177998569, 3.199952782857913,
  ]);
  const [searchedLocations, setSearchedLocations] = useState<
    locationInterface[]
  >([]);
  const [isRouteDiv, setIsRouteDiv] = useState<boolean>(true);
  const [changeMapView, setChangeMapView] = useState<boolean>(false);
  const [isHint, setIsHint] = useState<boolean>(true);

  // animation data
  const walkingPersonOption = {
    loop: true,
    autoplay: true,
    animationData: walkingPerson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const cyclingPersonOption = {
    loop: true,
    autoplay: true,
    animationData: cyclingPerson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const drivingOption = {
    loop: true,
    autoplay: true,
    animationData: driving,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // mapAnimationData

  const mapAnimationData = {
    loop: true,
    autoplay: true,
    animationData: mapAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const [currentAnimation, setCurrentAnimation] = useState<
    | typeof walkingPersonOption
    | typeof cyclingPersonOption
    | typeof drivingOption
    | typeof mapAnimationData
  >(walkingPersonOption);

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
    { name: "Lasu Radio", lat: 6.472812716519268, lng: 3.200558016376725 },
    {
      name: "3-in-1 Education",
      lat: 6.473152631738322,
      lng: 3.199601619019211,
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
    { name: "Julian Hostel", lat: 6.470652852809963, lng: 3.1957265700758 },
    { name: "Mass comm", lat: 6.4722600478125125, lng: 3.1997651061351653 },
    {
      name: "New health center",
      lat: 6.4657366170004735,
      lng: 3.2015953170227482,
    },
    {
      name: "Faculty of social science",
      lat: 6.475364733426094,
      lng: 3.1989487452080314,
    },
    {
      name: "Faculty of law",
      lat: 6.4674853055647015,
      lng: 3.2020847777720016,
    },
    // { name: "Julian Hostel", lat: 6.470652852809963, lng: 3.1957265700758 },
    // { name: "Julian Hostel", lat: 6.470652852809963, lng: 3.1957265700758 },
  ];
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userLabelMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const mapContainer = useRef(null);
  const [showSearched, setShowSearched] = useState(false);

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

  const searchLocation = (e: any): any => {
    let input: HTMLInputElement = e.target as HTMLInputElement;
    let value: string = input?.value;

    let newArray: locationInterface[] = [];
    if (value.length > 0) {
      locations.forEach((location: locationInterface) => {
        if (location.name?.toLowerCase().includes(value.toLowerCase())) {
          newArray.push(location);
        }
      });
    }

    setShowSearched(true);
    setSearchedLocations(newArray);
  };

  const bluSearchInput = () => {
    setShowSearched(false);
  };

  useEffect(() => {
    // Watch user's location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        let userLoc: locationInterface = {};
        userLoc.lat = latitude;
        userLoc.lng = longitude;
        console.log(userLoc);
        setUserLocation(userLoc);
      },
      (error) => {
        console.error("Error watching location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    console.log(selectedLocation);
  }, [selectedLocation]);

  console.log(userLocation);

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
      return streetView == "detailed"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/outdoors-v12";
    };

    mapboxgl.accessToken = apiKey as unknown as string;

    const initializeMap = async () => {
      const mapStyle = await getMapStyle();
      if (!mapStyle) return;

      const map = new mapboxgl.Map({
        container: mapContainer.current as any,
        style: mapStyle,
        center: coordinates,
        zoom: 17,
        maxZoom: 30,
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lng: longitude, lat: latitude };
          setUserLocation(location);

          map.flyTo({
            center: [selectedLocation.lng as any, selectedLocation.lat as any],
            zoom: 13,
          });
        },
        () => {
          toast.error("Error getting location");
        },
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0,
        }
      );

      map.addControl(new mapboxgl.NavigationControl());

      map.on("resize", () => {
        console.log("Map is resized");
        map.resize();
      });

      window.addEventListener("resize", () => {
        map.resize();
      });

      map.on("load", () => {
        if (!map.getSource("satellite") && streetView == "detailed") {
          map.addSource("satellite", {
            type: "raster",
            tiles: [
              `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${apiKey}`,
            ],
            tileSize: 256,
          });

          map.addLayer({
            id: "satellite-layer",
            type: "raster",
            source: "satellite",
          });
        }

        // Adjust brightness and contrast for the raster layer
        // map.setPaintProperty("satellite-layer", "raster-brightness-max", 1.5);
        // map.setPaintProperty("satellite-layer", "raster-brightness-min", 0.8);
        // map.setPaintProperty("satellite-layer", "raster-contrast", 0.2);
        map.setPaintProperty("satellite-layer", "raster-resampling", "nearest");
        map.setPaintProperty("satellite-layer", "raster-saturation", 0.1);
        map.setPaintProperty("satellite-layer", "raster-opacity", 1);
      });

      if (userLocation) {
        const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/${travelMethod}/${userLocation.lng},${userLocation.lat};${selectedLocation.lng},${selectedLocation.lat}?geometries=geojson&access_token=${apiKey}`;

        fetch(routeUrl)
          .then((response) => response.json())
          .then((data) => {
            const route = data.routes[0].geometry;

            map.on("load", () => {
              if (map.getLayer("route")) {
                map.removeLayer("route");
                map.removeSource("route");
              }

              map.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: route,
                  properties: {},
                },
              });

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
          .catch(() => {
            toast.error("Error fetching directions:");
          });
      }

      locations.forEach((location: locationInterface) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([location.lng as any, location.lat as any])
          .addTo(map);

        const label = document.createElement("div");
        label.className = "map-label" as any;
        label.innerText = location.name as any;

        new mapboxgl.Marker(label)
          .setLngLat([location.lng as any, location.lat as any])
          .addTo(map);

        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          location.name as any
        );
        marker.setPopup(popup);
      });

      const userMarker = new mapboxgl.Marker()
        .setLngLat([(userLocation as any).lng, (userLocation as any).lat])
        .addTo(map);

      const label = document.createElement("div");
      label.className = "map-label";
      label.innerText = "You";

      const userLabelMarker = new mapboxgl.Marker(label)
        .setLngLat([(userLocation as any).lng, (userLocation as any).lat])
        .addTo(map);

      // Function to smoothly move the marker
      const smoothMoveMarker = (marker: Marker, targetLngLat: any) => {
        const currentLngLat = marker.getLngLat();
        let startTime: any;

        const animate = (timestamp: any) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / 600, 1); // 300ms duration

          const lng =
            currentLngLat.lng +
            progress * (targetLngLat[0] - currentLngLat.lng);
          const lat =
            currentLngLat.lat +
            progress * (targetLngLat[1] - currentLngLat.lat);

          marker.setLngLat([lng, lat]);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            marker.setLngLat(targetLngLat); // Ensure exact position at the end
          }
        };

        requestAnimationFrame(animate);
      };

      // Set up references and apply smooth movement
      const targetLngLat = [
        (userLocation as any).lng,
        (userLocation as any).lat,
      ];
      smoothMoveMarker(userMarker, targetLngLat);
      smoothMoveMarker(userLabelMarker, targetLngLat);

      const userMarkerPopup = new mapboxgl.Popup({ offset: 25 }).setText("You");
      userMarker.setPopup(userMarkerPopup);
      userMarkerRef.current = userMarker;
      userLabelMarkerRef.current = userLabelMarker;

      setTimeout(() => {
        setIsRouteDiv(false);
        setChangeMapView(false);
      }, 3000);


      return () => {
        map.remove();
      };
    };

    initializeMap();
  }, [travelMethod, selectedLocation, streetView]);

  useEffect(() => {
    if (userLocation && userLocation.lng && userLocation.lat) {
      userMarkerRef.current?.setLngLat([userLocation.lng, userLocation.lat]);
      userLabelMarkerRef.current?.setLngLat([
        userLocation.lng,
        userLocation.lat,
      ]);
    }
  }, [userLocation]);


  // actual html part of project

  return (
    <>
      <div
        className="fiexd top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50"
        style={{ zIndex: 200 }}
      ></div>{" "}
      {/* for the under maintenance div */}

      {isRouteDiv && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 gap-y-6"
          style={{ zIndex: 200 }}
        >
          <div className={`${travelMethod == 'walking' ? 'w-96 h-96 object-cover' : 'max-w-full md:max-w-1/2 md:max-h-3/6 w-auto h-auto object-cover'}`}>
            <Lottie options={currentAnimation} height={'100%'} width={'100%'} style={{background: 'transparent'}}/>
          </div>
          <Fade direction="up" duration={500} delay={500} className="text-center primary-color text-xl text-white md:text-5xl"><h3>Finding the best route for you...</h3></Fade>
        </div>
      )}
      {changeMapView && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 gap-y-6"
          style={{ zIndex: 200 }}
        >
          <div className={`w-96 h-96 object-cover}`}>
            <Lottie options={mapAnimationData} height={'100%'} width={'100%'} style={{background: 'transparent'}}/>
          </div>
          <Fade direction="up" duration={500} delay={500} className="text-center primary-color text-xl text-white md:text-5xl"><h3>Customizing your map view...</h3></Fade>
        </div>
      )}
      <div className={`fixed top-0 bottom-0 left-0 right-0 bg-gray-50`}>
        <div
          className={`w-full m-0 shadow-lg h-20 flex flex-row items-center gap-x-3 justify-between`}
        >
          <div className={`flex flex-row items-center`}>
            <img
              src={lasuLogo}
              className={`bg-center bg-no-repeat bg-cover w-14 h-14 mx-2`}
            ></img>
            <div className="flex flex-col relative">
              <form
                className={`flex flex-row px-3 rounded-2xl ml-5 border-b border-gray-400`}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="text"
                  className={`bg-transparent text-gray-500 font-light p-2 focus:outline-none flex-grow md:w-64`}
                  placeholder="search..."
                  onInput={searchLocation}
                  onBlur={bluSearchInput}
                  onFocus={searchLocation}
                />
                <button
                  className={`w-16 h-16 rounded-full text-gray-600 flex items-center justify-center bg-gray-50 hover:border-transparent`}
                >
                  <BiSearch
                    className={`font-light text-gray-600 text-3xl`}
                  ></BiSearch>
                </button>
              </form>
              <div className="flex flex-col rounded-bl-2xl rounded-br-2xl ml-5 bg-gray-50 absolute top-16 z-50 overflow-y-auto w-full">
                {searchedLocations.map(
                  (location: locationInterface, index: number) => {
                    return (
                      showSearched && (
                        <div
                          className={`flex flex-row justify-between items-center text-2xl cursor-pointer hover:bg-gray-200 rounded-2xl py-6 w-full z-50`}
                          onClick={() => {
                            setSelectedLocation(location);
                            setIsRouteDiv(true);
                            setShowSearched(false);
                          }}
                          key={index}
                        >
                          <div className={`flex flex-row w-full pl-3`}>
                            <HiLocationMarker className="font-light text-gray-600 text-3xl mr-5"></HiLocationMarker>
                            <h3 className={`text-gray-600 font-light`}>
                              {location.name}
                            </h3>
                          </div>
                        </div>
                      )
                    );
                  }
                )}
              </div>
            </div>
            <div className="flex flex-col fixed bottom-10 right-5 z-50 shadow-lg p-2 rounded-3xl border border-gray-500 bg-gray-50 justify-center items-center md:shadow-none md:static md:rounded-none md:border-none md:flex-row md:bg-transparent">
              <button
                className={`w-16 h-16 rounded-full text-gray-600 flex items-center justify-center bg-gray-50 hover:border-transparent hover:bg-gray-200 ml-2`}
                title="Switch street view"
              >
                {streetView == "normal" ? (
                  <BiLayer
                    className={`font-light text-gray-600 text-3xl`}
                    onClick={() => {
                      setStreetView("detailed");
                      setChangeMapView(true);
                    }}
                  ></BiLayer>
                ) : (
                  <BiStreetView
                    className={`font-light text-gray-600 text-3xl`}
                    onClick={() => {
                      setStreetView("normal");
                      setChangeMapView(true);
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

        <div className="fixed z-40 top-24 right-14 rounded-3xl bg-gray-50 gap-x-2 text-gray-500 w-fit flex flex-row items-center p-3">
          <HiLocationMarker className="text-gray-500"></HiLocationMarker>
          {selectedLocation.name}
        </div>

        <div className="fixed z-40 bottom-10 right-32 md:right-14 rounded-3xl bg-gray-50 gap-x-2 text-gray-500 w-fit flex flex-row items-center p-3">
          With 💝 by <a href="https://portfolio-v2-z866.onrender.com/" target="_blank" className="text-sm text-blue-500 hover:underline">Bro Code</a>
        </div>

        <div className="fixed z-50 w-2/4 bottom-24 right-32 px-0 md:w-48 md:top-24 md:right-auto md:bottom-auto md:left-72 bg-gray-50 text-gray-500" style={{left: screen.width > 768 ? '460px' : '', display: isHint == true ? 'flex': 'none'}}>
          <div className="name_tag text-gray-500 w-full h-full mx-0">
            Click to view places on campus.
            <div className="flex justify-end w-full">
              <button className="p-2 rounded-xl text-blue-500 text-sm active:bg-blue-200 md:hover:bg-blue-200 hover:border-0 bg-blue-100 px-4 hover:outline-none" onClick={() => {setIsHint(false)}}>Ok</button>
            </div>
          </div>
        </div>

        <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
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
                if(travelMethod != 'walking'){
                  setIsRouteDiv(true);
                }
                setCurrentAnimation(walkingPersonOption);
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
                readOnly
              />
            </div>
            <div
              className={`flex flex-row justify-between items-center text-2xl p-3 cursor-pointer hover:bg-gray-200 rounded-2xl py-6`}
              onClick={() => {
                setTravelMethod("driving");
                if(travelMethod != 'driving'){
                  setIsRouteDiv(true);
                }
                setCurrentAnimation(drivingOption);
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
                readOnly
              />
            </div>
            <div
              className={`flex flex-row justify-between items-center text-2xl p-3 cursor-pointer hover:bg-gray-200 rounded-2xl py-6`}
              onClick={() => {
                setTravelMethod("cycling");
                if(travelMethod != 'cycling'){
                  setIsRouteDiv(true);
                }
                setCurrentAnimation(cyclingPersonOption);
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
                readOnly
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
                onClick={() => {
                  setShowPlaces(false);
                  setSelectedLocation(location);
                  setIsRouteDiv(true);
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
