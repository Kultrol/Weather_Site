"use client"
import React, {useState} from 'react';
import {WeatherInfo} from "@/app/weather/weatherData";
import WeatherForm from "./weatherForm";




function Page() {
    const [weatherInfo, setWeatherInfo] = useState<WeatherInfo| number>(0)

    if(typeof weatherInfo == 'number') {
        return (
            <div className={`grid grid-rows-5 grid-cols-3 w-full h-screen items-center justify-center`}>
                <WeatherForm setData={setWeatherInfo}/>
            </div>
        )
    } else {
        return (
            <div className={`grid grid-rows-5 grid-cols-3 w-full h-screen items-center justify-center`}>
                <WeatherForm setData={setWeatherInfo}/>
                <h1 className={`col-start-1 col-end-2 row-span-4`}>{weatherInfo.main.temp}</h1>
            </div>
        )
    }
}

export default Page;