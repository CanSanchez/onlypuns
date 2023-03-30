import react from "@heroicons/react";
import Image from "next/image";
import Lottie from "lottie-react";
import loading from "../public/loading.json";


export default function Loading(props) {

   //create an addpost button
    return (
        <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-slate-600/70 rounded fixed left-0 top-0 z-50 overflow-scroll">
            <div className="flex flex-col items-center justify-center w-1/4 h-1/4 rounded">
                <Lottie animationData={loading} loop={true} />
            </div>
        </div>
    )
}
        