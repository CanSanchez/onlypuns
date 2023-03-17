import React from "react";
import { useSession } from "next-auth/react";

import { getServerSession } from "next-auth";
import { useRouter } from "next/router";


export default function PunCard() {

    const { data: session } = useSession()

    const post = {
        image: "https://media.giphy.com/media/Qw4X3Fw75Tpt7bgNZQs/giphy.gif",
        caption: "I'm not a fan of puns, but I'm a big fan of puns.",
        likes: 5,
        comments: 2,
        tags: ["puns", "funny", "lol"],
    }

    const timAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    };


    return (
            <div className="bg-white shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden m-4 flex flex-col items-center justify-center py-4 w-full">
                <div className="flex flex-row items-center justify-start px-4 py-2 w-full">
                    <div className="flex flex-row items-end justify-center">
                        <img className="w-10 h-10 rounded-full mr-4" src={session.user.image} alt="Avatar of User"/>
                        <div className="text-sm">
                            <p className="text-gray-900 leading-none">{session.user.name}</p>
                            <p className="text-gray-600">{timAgo(new Date())}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center px-8 py-4 w-full">
                    <img className="w-full" src={post.image}/>
                    <h2 className="text-gray-900 font-bold text-1xl my-4 text-left w-full">{post.caption}</h2>
                </div>
                    <div className="flex flex-row items-center justify-start w-full px-8">
                        <div className="flex flex-row items-center justify-end bg-slate-200	py-2 px-4 rounded-full">
                            <img src="/icons/like.png" className="w-4 h-4 mr-2" />
                            <p className="font-semibold">Likes</p><p className="ml-2">{post.likes}</p>
                        </div>
                        <div className="flex flex-row items-center justify-end ml-4 bg-slate-200 py-2 px-4 rounded-full">
                            <img src="/icons/comment.png" className="w-4 h-4 mr-2" />
                            <p className="font-semibold">Comments</p><p className="ml-2">{post.comments}</p>
                        </div>
                    </div>
                <div className="flex flex-row items-center justify-start w-full px-8 my-6">
                    {post.tags.map((tag) => (
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
                    ))}
                </div>
            </div>
    )

}