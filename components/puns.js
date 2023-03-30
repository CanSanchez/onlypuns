
import React from "react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// import { authOptions } from "../src/pages/api/auth/[...nextauth]";

import { useSession, signIn, signOut } from "next-auth/react";
import EditPost from "./editpost";

export default function PunCard(props) {

    const { data: session } = useSession()
    const [loginPrompt, setLoginPrompt] = useState(false);
    // console.log(session)

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


    //show options for user to edit or delete post
    const [showOptions, setShowOptions] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleEdit = (pun) => {
        setShowEdit(true);
        setTobeEdited(pun)
    }

    //edit post
    const [tobeEdited, setTobeEdited] = useState();

    const handleUpdate = (id, caption, image, tags) => {
        props.updatePost(id, caption, image, tags)
    }


    //show comments
    const [showComments, setShowComments] = useState(false);

    const [newComment, setNewComment] = useState('');

    //add comment
    const handleComment = (e) => {
        e.preventDefault();
        props.addComment(newComment, props.pun.id, session.user.email)
        setNewComment('');
    }

    //delete comment
    const handleDeleteComment = (id, postId) => {
        props.deleteComment(id, postId)
    }

    //like post
    const handleLike = (id) => {

        session? (
            props.addLike(id, session.user.email)
        ) : (
            setLoginPrompt(true)
        )

    }

    //delete post
    const [showDelete, setShowDelete] = useState(false);
    const handleDelete = (id) => {
        props.deletePost(id)
    }
    
    return (
        <>
            <div className="bg-white shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden m-4 flex flex-col items-center justify-center py-4 w-full">
                <div className="flex flex-row items-center justify-between px-4 py-2 w-full">
                    <div className="flex flex-row items-end justify-center">
                            <Image width={30} height={30} className="w-10 h-10 rounded-full mr-4" src={props.pun.author.image} alt="Avatar of User"/>
                            <div className="text-sm">
                                <p className="text-gray-900 leading-none">{props.pun.author.name}</p>
                                <p className="text-gray-600">{timeAgo}
                                    {
                                        props.pun.createdAt !== props.pun.updatedAt && (
                                            <span className="text-gray-600"> (Edited)</span>
                                        )
                                    }
                                </p>
                            </div>
                    </div>
                    <div className="flex flex-row items-center justify-end w-fit relative cursor-pointer">
                        { props.pun.author && session ? (
                            <>
                            { session.user.email === props.pun.author.email && (
                                <Image width={30} height={30} className="w-4 h-4 mr-2 z-1" src="/icons/dots.png" alt="Options"
                                onClick={()=>setShowOptions(!showOptions)}/>
                            )}
                            </>
                            ) : null
                        }
                        {showOptions && (
                            <div className="flex flex-col items-start justify-center bg-white shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden flex-col p-6 w-max absolute right-0 top-6">
                                <span className="flex flex-row items-center justify-start m-2"
                                    onClick={()=>handleEdit(props.pun)}>
                                    <Image width={30} height={30} className="w-4 h-4 mr-2" src="/icons/edit.png" alt="Edit"/>
                                    <p className="text-gray-500 font-regular">Edit</p>
                                </span>
                                <span className="flex flex-row items-center justify-start m-2"
                                    onClick={()=>setShowDelete(!showDelete)}>
                                    <Image width={30} height={30} className="w-4 h-4 mr-2" src="/icons/delete.png" alt="Delete"/>
                                    <p className="text-gray-500 font-regular">
                                        Delete
                                    </p>
                                </span>
                            </div>
                        )}
                            {
                                showDelete && (
                                    <div className="flex flex-col items-center justify-center bg-white shadow-[0px_10px_30px_-5px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden flex-col p-6 w-max absolute right-0 top-6">
                                        <p className="text-gray-500 font-regular">Are you sure you want to delete this post?</p>
                                        <div className="flex flex-row items-center justify-center w-full">
                                            <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-full m-2"
                                                onClick={()=>handleDelete(props.pun.id)}>
                                                Delete
                                            </button>
                                            <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded-full m-2"
                                                onClick={()=>setShowDelete(!showDelete)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center px-8 py-4 w-full">
                    <Image height={400} width={400} priority alt={props.pun.caption} className="w-full" src={props.pun.image}/>
                    <Link href={`/puns/${props.pun.id}`} className="w-full">
                        <h2 className="text-gray-900 font-bold text-1xl my-4 text-left w-full">{props.pun.caption}</h2>
                    </Link>
                </div>
                    <div className="flex flex-row items-center justify-start w-full px-8">
                        <div className="flex flex-row items-center justify-end bg-slate-200	py-2 px-4 rounded-full cursor-pointer hover:bg-sky-100"
                            onClick={()=>handleLike(props.pun.id)}>
                            <Image alt="like icon" width={30} height={30} src="/icons/like.png" className="w-4 h-4 mr-2" />
                            <p className="font-semibold">Likes</p>
                            {props.pun.likes? (
                                <p className="ml-2">{props.pun.likes.length}</p>
                            ) : (
                                <p className="ml-2">0</p>
                            )}
                        </div>
                        <div className="flex flex-row items-center justify-end ml-4 bg-slate-200 py-2 px-4 rounded-full cursor-pointer hover:bg-sky-100"
                            onClick={()=>setShowComments(!showComments)}>
                            <Image alt="comment icon" width={30} height={30} src="/icons/comment.png" className="w-4 h-4 mr-2" />
                            <p className="font-semibold">Comments</p>
                            {props.pun.comments? (
                                <p className="ml-2">{props.pun.comments.length}</p>
                            ) : (
                                <p className="ml-2">0</p>
                            )}
                        </div>
                    </div>
                <div className="flex flex-row items-center justify-start w-full px-8 my-6 flex-wrap">
                    { props.pun.tags && props.pun.tags.map((tag) => (
                        <span key={tag.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 flex-nowrap">#{tag.tag}</span>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center w-full px-8 m-4">
                {showComments && (
                    <div className="flex flex-col items-center justify-center w-full">
                        { session ? (
                            <div className="flex flex-row items-center justify-start w-full">
                                <form className="flex flex-row items-center justify-start w-full" onSubmit={handleComment}>
                                    <input type="text" className="bg-gray-100 rounded-full w-full mr-4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" placeholder="Add a comment..."
                                        name="comment" id="comment" autoComplete="off" value={newComment}
                                        onKeyDown={(e)=>e.key === 'Enter' && handleComment(e)}
                                        onChange={(e)=>setNewComment(e.target.value)}/>
                                    <button type="submit">
                                        <Image alt="comment icon" width={30} height={30} src="/icons/send.png" className="w-4 h-4"/>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-start w-full">
                                <p className="text-gray-600 font-regular underline underline-offset-4 cursor-pointer"
                                    onClick={()=>setLoginPrompt(!loginPrompt)}>
                                    Login to comment
                                </p>
                            </div>
                        )}
                        { props.pun.comments && props.pun.comments.map((comment) => (
                             <div key={comment.id} className="flex flex-row items-center justify-start w-full my-4">
                                {
                                    comment.author? ( 
                                        <>
                                        <Image width={30} height={30} className="w-10 h-10 rounded-full mr-4" src={comment.author.image} alt="Avatar of User"/>
                                        <div className="text-sm w-full">
                                            <p className="text-gray-900 leading-none">{comment.author.name}</p>
                                            <p className="text-gray-600">{comment.text}</p>
                                        </div>
                                        </>
                                    ) : (
                                        <>
                                        <Image width={30} height={30} className="w-10 h-10 rounded-full mr-4" src={session.user.image} alt="Avatar of User"/>
                                        <div className="text-sm w-full">
                                            <p className="text-gray-900 leading-none">{session.user.name}</p>
                                            <p className="text-gray-600">{comment.text}</p>
                                        </div>
                                        </>
                                    )
                                }
                                {
                                    session && ( 
                                        comment.author ? (
                                            comment.author ? (
                                                <>
                                                {(session.user.email === comment.author.email || session.user.email === props.pun.author.email ) && (
                                                    <span className="flex flex-row items-center justify-start m-2"
                                                        onClick={()=>handleDeleteComment(comment.id, comment.postId)}>
                                                        <Image width={30} height={30} className="w-4 h-4 mr-2" src="/icons/delete.png" alt="Delete"/>
                                                    </span>
                                                )}
                                                </>
                                            ) : (
                                                <>
                                                {(session.user.email === props.pun.author.email ) && (
                                                    <span className="flex flex-row items-center justify-start m-2"
                                                        onClick={()=>handleDeleteComment(comment.id, comment.postId)}>
                                                        <Image width={30} height={30} className="w-4 h-4 mr-2" src="/icons/delete.png" alt="Delete"/>
                                                    </span>
                                                )}
                                                </>
                                            )
                                        ) : (
                                            <></>
                                        )
                                    )
                                }
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>
            {
                loginPrompt && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center tablet:px-6 mobile:px-4">
                        <div className="flex flex-col items-center justify-center bg-white w-1/2 h-1/2 rounded-lg tablet:w-full mobile:w-full">
                            <h2 className="text-gray-700 font-bold text-2xl my-6">Please Login</h2>
                            <span className="flex flex-row items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2 cursor-pointer"
                                onClick={()=>signIn('google')}>
                                <Image alt="google icon" width={30} height={30} src="/icons/google.png" className="w-4 h-4 mr-2 cursor-pointer" />
                                Login with Google
                            </span>
                            <span className="flex flex-row items-center justify-center bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2 cursor-pointer"
                                onClick={()=>signIn('github')}>
                                <Image alt="github icon" width={30} height={30} src="/icons/github.png" className="w-4 h-4 mr-2 cursor-pointer" />
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
            {
                showEdit && (
                    <div className="fixed top-0 left-0 z-10 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center tablet:px-6 mobile:px-4">
                        <div className="flex flex-col items-center justify-center bg-white w-1/2 h-1/2 rounded-lg tablet:w-full mobile:w-full">
                            <h2 className="text-gray-700 font-bold text-2xl my-6">Edit Pun</h2>
                            <EditPost 
                                pun={tobeEdited} 
                                setEdit={setShowEdit}
                                handleUpdate={handleUpdate}
                                session={session}/>
                        </div>
                    </div>
                )
            }
    </>
    )

}
