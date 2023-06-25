import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {getWeather, getZip} from "@/app/weather/weatherData";
import {useEffect, useState} from "react";

// @ts-ignore
function WeatherForm({setData}){

    const [apiKey, setApiKey] = useState<string>("");

    const {
        reset,
        register,
        formState,// function to register input fields
        formState: { errors, isSubmitSuccessful }, // object containing any validation errors in the form
        handleSubmit, // function to handle form submission
    } = useForm();

    const onSubmit:SubmitHandler<FieldValues> = async (userData) => {
        const zipCode = userData.zipCode;
        const apiKey = userData.apiKey;
        const coordinates = await getZip(zipCode, apiKey); //TODO: Create a error handler for 401 and 404 messages for the end-user.
        if(typeof coordinates === 'number'){
            if(coordinates === 401){
                return  console.error(`Bad Auth: Invalid API Key, please use a valid API.`)
            } else if( coordinates === 404){
                return  console.error(`Zipcode not found, please try again with a different code.`)
            } else {
                return console.error(`Unknown error, this was an unexpected error.\n Status Code: ${coordinates}`)
            }
        }
        const weatherData = await getWeather(coordinates, apiKey);
        if(typeof weatherData === 'number'){
            if(weatherData === 401){
                return  console.error(`Bad Auth: Invalid API Key, please use a valid API.`)
            } else if( weatherData === 404){
                return  console.error(`Improper Geo Coordinates, please try different coordinates.`)
            } else {
                return console.error(`Unknown error, this was an unexpected error.\n Status Code: ${weatherData}`)
            }
        }
        setData(weatherData);
        setApiKey(apiKey);
    }

    useEffect(() => {
        if(formState.isSubmitSuccessful){
            reset({
                apiKey: `${apiKey}`,
                zipCode: ""
            });

        }
    }, [apiKey, formState, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col row-start-3 col-start-2 col-end-2 mx-12 items-center`}>
            {/* Input field for API key with validation rules */}
            <input type="text" placeholder={`Enter your API key`} {...register("apiKey", {required:true, minLength:32, maxLength:32})} className={`border-2 border-black mb-2 px-2 py-1 rounded`}/>

            {/* Error messages for invalid API Key */}
            {errors.apiKey?.type === "minLength" && (<h1 className={`col-start-1 col-end-2 row-span-4`}>Must be a valid API Key</h1>)}
            {errors.apiKey?.type === "maxLength" && (<h1 className={`col-start-1 col-end-2 row-span-4`}>Must be a valid API Key</h1>)}
            {errors.apiKey?.type === "required" && (<h1 className={`col-start-1 col-end-2 row-span-4`}>Must submit a API Key</h1>)}

            {/* Input field for zipcode with validation rules */}
            <input type="text" placeholder={`Zipcode`} {...register("zipCode", {required:true, minLength:5, maxLength:5})} className={`border-2 border-black px-2 py-1 rounded`}/>

            {/* Error messages for invalid zip code */}
            {errors.zipCode?.type === "minLength" && (<h1 className={`col-start-1 col-end-2 row-span-4`}>Must be a valid zip code</h1>)}
            {errors.zipCode?.type === "maxLength" && (<h1 className={`col-start-1 col-end-2 row-span-4`}>Must be a valid zip code</h1>)}
            {errors.zipCode?.type === "required" && (<h1 className={`col-start-1 col-end-2 row-span-4`}>Must submit a zipcode</h1>)}

            <input type="submit" className={`border-2 border-black mt-2 px-2 py-1 rounded hover:border-blue-500 hover:transition hover:cursor-pointer`}/>
        </form>
    );
}
export default WeatherForm;
