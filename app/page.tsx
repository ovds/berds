'use client'

import {useState} from "react";
import {Center, ChakraProvider, Select} from "@chakra-ui/react";

const locations = {
    "Freeze": {
        "latitude": 1.2983333333333331,
        "longitude": 103.76138888888889
    },
    "Lava": {
        "latitude": 1.2980555555555555,
        "longitude": 103.76194444444444
    },
    "Marbles": {
        "latitude": 1.2966666666666666,
        "longitude": 103.7611111111111
    },
    "Plant": {
        "latitude": 1.2994444444444444,
        "longitude": 103.76027777777777
    },
    "Tag": {
        "latitude": 1.2988888888888888,
        "longitude": 103.76055555555556
    },
    "Volleyball": {
        "latitude": 1.2977777777777777,
        "longitude": 103.76027777777777
    }
}

export default function Home() {
    const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
    const [place, setPlace] = useState("Select location");

    function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
         // Distance in m
        return R * c * 1000;
    }

    function deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    if (typeof navigator !== "undefined") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation(position);
            });
        } else {
            console.log("Not Available");
        }
    }

    function mapDistanceToValue(distance: number) {
        const minDistance = 0;
        const maxDistance = 400;
        const minValue = 0;
        const maxValue = 255;

        // Ensure the distance is within the expected range
        distance = Math.max(minDistance, Math.min(maxDistance, distance));

        // Map the distance to a value between 0 and 100
        return ((distance - minDistance) / (maxDistance - minDistance)) * (maxValue - minValue) + minValue;
    }

    const getDistance = (place: string) => {
        if (place == 'Select location') return "Select a location";
        if (userLocation) {
            // @ts-ignore
            const distance = getDistanceFromLatLonInKm(userLocation.coords.latitude, userLocation.coords.longitude, locations[place].latitude, locations[place].longitude);
            return distance.toFixed(2);
        }
        return "Loading...";
    }

    const getDistanceColor = (place: string) => {
        if (place == 'Select location') return "150, 150, 150";
        const distance = getDistance(place);
        const value = mapDistanceToValue(parseFloat(distance));
        if (value > 50) {
            return `255, ${255 - value}, ${255 - value}`;
        } else {
            return `${value}, 255, ${value}`;
        }
    }

    return (
        <ChakraProvider>
            <div className={'bg-slate-700 w-screen h-screen pt-10 px-5 flex flex-col text-center align-center justify-center'}>
                <Select placeholder="Select location" onChange={(e) => setPlace(e.target.value)} variant={'filled'} bg={'white'} className={'bg-white'}>
                    {Object.keys(locations).map((place, i) => {
                        return <option key={i} value={place}>{place}</option>
                    })}
                </Select>
                <Center className={'w-full h-full'}>
                    <div className={'text-center justify-center align-center flex flex-col px-5 h-1/2 w-full rounded-2xl'} style={ {backgroundColor: `rgb(${getDistanceColor(place)})`} }></div>
                </Center>
            </div>
        </ChakraProvider>
    )
}
