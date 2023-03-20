
import React from "react";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";



export default function PunCard(props) {

    const { data: session } = useSession()

    // const post = {
    //     image: "https://media.giphy.com/media/Qw4X3Fw75Tpt7bgNZQs/giphy.gif",
    //     caption: "I'm not a fan of puns, but I'm a big fan of puns.",
    //     likes: 5,
    //     comments: 2,
    //     tags: ["puns", "funny", "lol"],
    // }


    const [timeAgo, setTimeAgo] = useState('');

    // change date format to time ago
    const date = new Date(props.pun.createdAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));
    const diffHours = Math.floor(diff / (1000 * 3600));
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffSeconds = Math.floor(diff / (1000));

    useEffect(() => {
        if (diffDays > 0) {
            setTimeAgo(diffDays + (diffDays > 1 ? ' days ago' : ' day ago'));
        } else if (diffHours > 0) {
            setTimeAgo(diffHours + (diffHours > 1 ? ' hours ago' : ' hour ago'));
        } else if (diffMinutes > 0) {
            setTimeAgo(diffMinutes + (diffMinutes > 1 ? ' minutes ago' : ' minute ago'));
        } else {
            setTimeAgo(diffSeconds + (diffSeconds > 1 ? ' seconds ago' : ' second ago'));
        }
    }, [diffDays, diffHours, diffMinutes, diffSeconds])

    console.log(props.pun.tags)

    return (
            <div className="bg-white shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden m-4 flex flex-col items-center justify-center py-4 w-full">
                <div className="flex flex-row items-center justify-start px-4 py-2 w-full">
                    <div className="flex flex-row items-end justify-center">
                        <img className="w-10 h-10 rounded-full mr-4" src={props.pun.author.image} alt="Avatar of User"/>
                        <div className="text-sm">
                            <p className="text-gray-900 leading-none">{props.pun.author.name}</p>
                            <p className="text-gray-600">{timeAgo}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center px-8 py-4 w-full">
                    <img className="w-full" src={props.pun.image}/>
                    <h2 className="text-gray-900 font-bold text-1xl my-4 text-left w-full">{props.pun.caption}</h2>
                </div>
                    <div className="flex flex-row items-center justify-start w-full px-8">
                        <div className="flex flex-row items-center justify-end bg-slate-200	py-2 px-4 rounded-full">
                            <img src="/icons/like.png" className="w-4 h-4 mr-2" />
                            <p className="font-semibold">Likes</p><p className="ml-2">{props.pun.likes}</p>
                        </div>
                        <div className="flex flex-row items-center justify-end ml-4 bg-slate-200 py-2 px-4 rounded-full">
                            <img src="/icons/comment.png" className="w-4 h-4 mr-2" />
                            <p className="font-semibold">Comments</p><p className="ml-2">{props.pun.comments}</p>
                        </div>
                    </div>
                <div className="flex flex-row items-center justify-start w-full px-8 my-6">
                    {/* {props.pun.tags.map((tag) => (
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
                    ))} */}
                    {props.pun.tags.map((tag) => (
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag.tag}</span>
                    ))}
                </div>
            </div>
    )

}
