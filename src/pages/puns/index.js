import Head from 'next/head'
import React, { useEffect } from "react";
import NavBar from '../../../components/navbar';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]'
import PunCard from '../../../components/puns';
import { prisma } from '../../../server/db/client';
import { useState } from 'react';
import Loading from '../../../components/loading';
import AddPost from '../../../components/addpost';

export default function Home( { posts } ) {

    const [puns, setPuns] = useState(posts)
    // console.log(posts)
    // console.log(puns)

    const router = useRouter();
    const { data: session } = useSession()
    //console.log(session)

    //delete post using prisma
    const deletePost = async (id) => {
        setLoading(true)
       try {
        const res = await fetch(`/api/puns/${id}`, {
               method: 'DELETE'
        })

        setPuns(puns.filter(pun => pun.id !== id))
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    //add post using prisma
    const addPost = async (caption, image, tags, authorId) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/puns`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    caption,
                    image,
                    tags,
                    authorId,
                })
            })
            const data = await res.json()
            console.log(data)
            setPuns([data, ...puns])
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    } 

    //update post using prisma

    const updatePost = async (id, caption, image, tags) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/puns/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    caption,
                    image,
                    tags,
                })
            })
            const data = await res.json()
            setPuns(puns.map(pun => pun.id === id ? {...pun, caption, image, tags} : pun))
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    //add comment using prisma
    const addComment = async (comment, id, email) => {
        try {
            const res = await fetch(`/api/puns/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    text: comment,
                    authorId: email,
                })
            })
            const data = await res.json()

            // update new comment to puns state
            const newPuns = puns.map(pun => pun.id === id ? {...pun, comments: [data, ...pun.comments]} : pun)
            // console.log("newPuns", newPuns)
            setPuns(newPuns)
        } catch (error) {
            console.log(error)
        }
    }

    //delete comment using prisma
    const deleteComment = async (id, postId) => {
        try {
            const res = await fetch(`/api/puns/${postId}/comments/${id}`, {
                method: 'DELETE'
            })

            const newPuns = puns.map(pun => pun.id === postId ? {...pun, comments: pun.comments.filter(comment => comment.id !== id)} : pun)
            setPuns(newPuns)

        }  catch (error) {
            console.log(error)
        }
    }

    //add like using prisma
    const addLike = async (id, authorId) => {
        try {
            const res = await fetch(`/api/puns/${id}/likes`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    postId: id,
                    authorId,
                })
            })
            const data = await res.json()
            const newPuns = puns.map(pun => pun.id === id ? {...pun, likes: [data, ...pun.likes]} : pun)
            setPuns(newPuns)
        } catch (error) {
            console.log(error)
        }
    }

    //loading

    const [loading, setLoading] = useState(false);

  return (
    <>
        <Head>
            <title>OnlyPuns</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/onlypuns.png" />
        </Head>
        <main className='max-w-screen min-h-full'>
            <NavBar session={session} addPost={addPost} />
            {loading && <Loading />}
            <div className="flex flex-col items-center justify-center min-h-screen max-w-screen py-4 pt-24 my-4">
                <div className="flex flex-col items-center justify-center min-h-full w-6/12 py-2 tablet:w-9/12 mobile:w-screen">
                {
                    puns.map(pun => (
                        <PunCard
                            deleteComment={deleteComment}
                            addLike={addLike}
                            addComment={addComment}
                            session={session} 
                            key={pun.id}
                            deletePost={deletePost}
                            updatePost={updatePost}
                            pun={pun} />
                    ))
                }
                </div>
            </div>
            <div className="hidden fixed bottom-0 right-0 mb-4 mr-4 tablet:block mobile:block">
                <AddPost session={session} addPost={addPost} />
            </div>
        </main>
    </>
  )
}

export async function getServerSideProps(context) {

    const session = await getServerSession(context.req, context.res, authOptions)
    
    const posts = await prisma.post.findMany(
        {
            include: {
                tags: true,
                likes: true,
                comments: {
                    include: {
                        author: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                author: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        }
    )

    const objArray = JSON.parse(JSON.stringify(posts))

    const transformedArray = objArray.map((obj) => {
        return {
            ...obj,
        }
    })

  
    // if (!session) {
    //     //redirect to login page
    //     return {
    //     redirect: {
    //         destination: "/",
    //         permanent: false,
    //     },
    //     }
    // }

    return {
        props: {
        session,
        posts: transformedArray
        },
    }
}



