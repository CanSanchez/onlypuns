import react from "@heroicons/react";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import axios from "axios";

export default function AddPost(props) {

    const [loginPrompt, setLoginPrompt] = useState(false);
    const [show, setShow] = useState(false);

    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [tags, setTags] = useState([]);

    const [pendingImage, setPendingImage] = useState("");

    console.log(caption, image, tags)

    const handleTags = (e) => {
        const tag = e.target.value;
        const tagArray = tag.split(",");
        setTags(tagArray);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        props.addPost(caption, image, tags, props.session.user.email)
        setShow(false);
    }

    const handleImage = (file) => {
       
        setPendingImage(file);
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
    <>
        <div className="flex flex-col items-center justify-center w-fit h-fit mr-4">
            {props.session ? (
                <button className="flex flex-row items-center justify-center w-fit h-1/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full m-2" onClick={() => setShow(!show)}>
                    <PencilIcon className="w-4 h-4 mr-2" /> <p>Add Post</p>
                </button>
            ) : (
                <button className="flex flex-row items-center justify-center w-fit h-1/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full m-2" onClick={() => setLoginPrompt(!loginPrompt)}>
                    <PencilIcon className="w-4 h-4 mr-2" /> <p>Add Post</p>
                </button>
            )}
            {show && (
                <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-slate-600/70 rounded fixed left-0 top-0 z-50 overflow-scroll">
                    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-1/2 h-[90%] relative tablet:w-full mobile:w-full">
                        {/* model Post {
                            id        Int      @id @default(autoincrement())
                            createdAt DateTime @default(now())
                            updatedAt DateTime @updatedAt
                            caption    String
                            image      String
                            comments   Comments[]
                            likes      Likes[]
                            author    User     @relation(fields: [authorId], references: [id])
                            authorId  String
                            tags      Tags[]
                            } */}
                         <div className="bg-white shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden m-4 flex flex-col items-center justify-center py-4 w-full">
                                    <div className="flex flex-row items-center justify-between px-4 py-2 w-full">
                                        <div className="flex flex-row items-center justify-center">
                                            <Image width={40} height={40} className="rounded-full mr-2" src={props.session.user.image} alt="Avatar of User"/>
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
                                            image ?
                                            <>
                                                <Image alt="upload icon" width={400} height={400} src={URL.createObjectURL(pendingImage)} className="w-full h-[300px] object-cover"/>
                                            </>
                                                :
                                            <>
                                                {/* <Image alt="upload icon" width={30} height={30} src="/icons/upload.png" className="w-4 h-4 mr-2" /> */}
                                                <p className="font-semibold">Upload Pun 😃</p>
                                            </>
                                        }

                                        </label>
                                        <input type="text" name="caption" id="caption" placeholder="Caption" className="w-full h-12 bg-slate-200 rounded-lg px-4 mt-4"
                                            value={caption} 
                                            onChange={(e)=>setCaption(e.target.value)}/>
                                        <input type="text" name="tags" id="tags" className="w-full h-12 bg-slate-200 rounded-lg px-4 mt-4"
                                            placeholder="Tags seperated by commas"
                                            onChange={(e)=>handleTags(e)}/>
                                    </div>
                                    <div className="flex flex-row items-center justify-start px-4 py-2 w-full flex-wrap">
                                        {
                                        tags.map((tag, index) => (
                                                <div key={index} className="flex flex-row items-center justify-center bg-slate-200 rounded-full px-4 py-2 m-2">
                                                    <p className="text-sm text-gray-700 font-semibold">#{tags[index]}</p>
                                                </div>  
                                            ))
                                        }
                                    </div>
                                    <div className="flex flex-col items-center justify-center px-4 py-2 w-full">
                                        <button className="flex flex-row items-center justify-center w-1/2 h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full m-2"
                                            type="submit">
                                            <PencilIcon className="w-4 h-4 mr-2" /> <p>Post Pun</p>
                                        </button>
                                        <p className="cursor-pointer text underline underline-offset-4" onClick={() => setShow(!show)}>
                                            Cancel
                                        </p>
                                    </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
        {
            loginPrompt && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center tablet:px-6 mobile:px-4">
                    <div className="flex flex-col items-center justify-center bg-white w-1/2 h-1/2 rounded-lg tablet:w-full mobile:w-full">
                        <h2 className="text-gray-700 font-bold text-2xl my-6">Please Login</h2>
                        <span className="flex flex-row items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2"
                            onClick={()=>signIn('google')}>
                            <Image alt="google icon" width={30} height={30} src="/icons/google.png" className="w-4 h-4 mr-2" />
                            Login with Google
                        </span>
                        <span className="flex flex-row items-center justify-center bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2"
                            onClick={()=>signIn('github')}>
                            <Image alt="github icon" width={30} height={30} src="/icons/github.png" className="w-4 h-4 mr-2" />
                            Login with GitHub
                        </span>
                        {/* cancel */}
                        <p className="text-gray-900 text-sm my-4 underline cursor-pointer"
                            onClick={()=>setLoginPrompt(false)}>
                            Cancel
                        </p>
                    </div>
                </div>
            )
        }
    </>
    )
}
        