import react from "@heroicons/react";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import axios from "axios";

export default function EditPost(props) {

    console.log(props.pun)
   //create an addpost button

    const [caption, setCaption] = useState(props.pun.caption);
    const [image, setImage] = useState(props.pun.image);
    const [tags, setTags] = useState(props.pun.tags.map(tag => tag.tag));

    const [pendingImage, setPendingImage] = useState();

    console.log(caption, image, tags)

    const handleTags = (e) => {
        const tag = e.target.value;
        const tagArray = tag.split(",");
        setTags(tagArray);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
       
       props.handleUpdate(props.pun.id, caption, image, tags);

       props.setEdit(false);
    }

    const handleImage = (file) => {
       
        setPendingImage(URL.createObjectURL(file));
        // console.log(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "onlypuns");
        formData.append("effect", "loop");

        axios.post('https://api.cloudinary.com/v1_1/djhxv0heo/image/upload', formData).then((res) => {
            console.log(res.data.secure_url);
            setImage(res.data.secure_url);
        });
        // console.log(image);
    }


    
    return (
        <div className="flex flex-col items-center justify-center w-fit h-fit">
                <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-slate-600/70 rounded fixed left-0 top-0 z-50 overflow-scroll mobile:h-full mobile:py-4">
                    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-1/2 h-fit relative tablet:w-[90%] mobile:w-full">
                         <div className="bg-white shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden m-4 flex flex-col items-center justify-center py-4 w-full">
                                    <div className="flex flex-row items-center justify-between px-4 py-2 w-full">
                                        <div className="flex flex-row items-center justify-center">
                                            <Image width={40} height={40} className="rounded-full mr-2" src={props.session.user.image} alt="user image" />
                                            <div className="text-sm">
                                                <p className="text-gray-900 leading-none">{props.session.user.name}</p>
                                                <p className="text-gray-600">Now</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center px-8 py-4 w-full h-max">
                                        <input type="file" name="image" id="image" className="hidden" onChange={(e)=>handleImage(e.target.files[0])} />
                                        <label htmlFor="image" className="flex flex-row items-center justify-center w-full h-[300px] min-h-[200px] bg-slate-200 rounded-lg cursor-pointer object-cover">
                                        {
                                            pendingImage ?
                                            <>
                                                <Image alt="upload icon" width={400} height={400} src={pendingImage} className="w-full h-[300px] object-cover"/>
                                            </>
                                                :
                                            <>
                                                <Image alt="upload icon" width={400} height={400} src={image} className="w-full h-[300px] object-cover"/>
                                            </>
                                        }

                                        </label>
                                        <input type="text" name="caption" id="caption" placeholder="Caption" className="w-full h-12 bg-slate-200 rounded-lg px-4 mt-4"
                                            value={caption} 
                                            onChange={(e)=>setCaption(e.target.value)}/>
                                        <input type="text" name="tags" id="tags" className="w-full h-12 bg-slate-200 rounded-lg px-4 mt-4"
                                            value={tags}
                                            placeholder="Tags seperated by commas"
                                            onChange={(e)=>handleTags(e)}/>
                                    </div>
                                    <div className="flex flex-row items-center justify-start px-4 py-2 w-full flex-wrap">
                                        {
                                            tags.map((tag, index) => (
                                                    <div key={index} className="flex flex-row items-center justify-center bg-slate-200 rounded-full px-4 py-2 m-2">
                                                        <p className="text-sm text-gray-700 font-semibold">#{tag}</p>
                                                    </div>  
                                                ))
                                        }
                                    </div>
                                    <div className="flex flex-col items-center justify-center px-4 py-2 w-full">
                                        <button className="flex flex-row items-center justify-center w-1/2 h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full m-2"
                                            type="submit">
                                            <p>Save</p>
                                        </button>
                                        <p className="cursor-pointer text underline underline-offset-4" onClick={() => props.setEdit(false)}>
                                            Cancel
                                        </p>
                                    </div>
                        </div>
                    </form>
                </div>
        </div>
    )
}
        