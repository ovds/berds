'use client'

import {useEffect, useState} from "react";
import Image from 'next/image';
import * as geolib from "geolib";

const locations = {
    "Marbles": {
        "latitude": "1°17'48\"N",
        "longitude": "103°45'40\"E"
    },
    "Lava": {
        "latitude": "1°17'53\"N",
        "longitude": "103°45'43\"E"
    },
    "Volleyball": {
        "latitude": "1º17'52.21\"N",
        "longitude": "103º45'37.88\"E"
    },
    "Freeze": {
        "latitude": "1º17'54.37\"N",
        "longitude": "103º45'41.37\"E"
    },
    "Plant": {
        "latitude": "1°17'58\"N",
        "longitude": "103°45'37\"E"
    },
    "Tag": {
        "latitude": "1°17'56\"N",
        "longitude": "103°45'38\"E"
    }
}

export default function Home() {
    const [text, setText] = useState('');
    const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
    const [userHeading, setUserHeading] = useState(0);
    const [angle, setAngle] = useState(0);
    const place = "Marbles";

    if (typeof navigator !== "undefined") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation(position);
            });
        } else {
            console.log("Not Available");
        }
    }

    if (typeof window !== "undefined") {
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", handleOrientation);
        } else {
            console.log("DeviceOrientationEvent is not supported");
        }
    }

    function handleOrientation(event: any) {
        var alpha;
        // Check for iOS property
        if (event.webkitCompassHeading) {
            alpha = event.webkitCompassHeading;
        }
        // non iOS
        else {
            alpha = event.alpha;
        }
        setUserHeading(alpha);
    }

    useEffect(() => {
        if (userLocation != null) {
            setAngle(getBearing() - userHeading);
            rotateImage(angle);
        }
    }, [userLocation]);

    const getBearing = () => {
        if (userLocation == null) {
            return 0;
        }
        return geolib.getGreatCircleBearing(
            {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
            },
            {
                latitude: locations[place].latitude,
                longitude: locations[place].longitude,
            }
        );
    };

    const rotateImage = (angle: number) => {
        const image = document.getElementById("arrow");
        if (image == null) {
            return;
        }
        image.style.transform = `rotate(${userHeading}deg)`;
    };

    return (
        <div className={'bg-slate-700 w-screen h-screen pt-10 px-5'}>
            <h1>{userHeading}</h1>
            <Image
                id="arrow"
                src="/arrow.png"
                width={100}
                height={100}
                className="absolute top-1/2 left-1/3 transform -translate-x-2/3 -translate-y-1/2 transition duration-500 ease-in-out"
                 alt={'Arrow'}></Image>
        </div>
    )
}
