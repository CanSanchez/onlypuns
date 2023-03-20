import react from "@heroicons/react";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function AddPost() {

   //create an addpost button

    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <button className="flex flex-row items-center justify-center w-fit h-1/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full m-2" onClick={() => setShow(!show)}>
                <PencilIcon className="w-4 h-4 mr-2" /> <p>Add Post</p>
            </button>
            {show && (
                <div className="flex flex-col items-center justify-center w-1/2 h-1/2 bg-gray-200 rounded">
                    <input className="w-1/2 h-1/12 m-2" type="text" placeholder="Title" />
                    <textarea className="w-1/2 h-1/2 m-2" type="text" placeholder="Pun" />
                    <button className="w-1/12 h-1/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={() => setShow(!show)}>
                        Submit
                    </button>
                </div>
            )}
        </div>
    )
}
        