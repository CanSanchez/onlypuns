import Head from 'next/head'
import React, { useEffect } from "react";
import NavBar from '../../../components/navbar';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]'
import PunCard from '../../../components/puns';
import AddPost from '../../../components/addpost';
// import { prisma } from '../../../server/db/client';
import { useState } from 'react';

export default function Home( { posts } ) {




const [puns, setPuns] = useState(posts)
    // console.log(posts)
    // console.log(puns)

  const router = useRouter();

  const { data: session } = useSession()

//   console.log(session)

//delete post using prisma

    const deletePost = async (id) => {

       try {

            const res = await fetch(`/api/puns/${id}`, {
               method: 'DELETE'
           })

           setPuns(puns.filter(pun => pun.id !== id))

       } catch (error) {
              console.log(error)
        }
    }


    // add comment using prisma
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
            console.log("puns", puns)
            const newPuns = puns.map(pun => pun.id === id ? {...pun, comments: [data, ...pun.comments]} : pun)
            console.log("newPuns", newPuns)
            setPuns(newPuns)

        } catch (error) {
            console.log(error)
        }
    }

    const deleteComment = async (id, postId) => {

        try {

            const res = await fetch(`/api/puns/${postId}/comments/${id}`, {
                method: 'DELETE'
            })

            const newPuns = puns.map(pun => pun.id === postId ? {...pun, comments: pun.comments.filter(comment => comment.id !== id)} : pun)
            setPuns(newPuns)

        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
        <Head>
            <title>OnlyPuns</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/onlypuns.png" />
        </Head>
        <main>
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-screen max-w-screen py-4 pt-24 my-4">
        <AddPost />
            <div className="flex flex-col items-center justify-center min-h-full w-6/12 py-2">
            {
                puns.map(pun => (
                    <PunCard
                        deleteComment={deleteComment}
                        addComment={addComment}
                        session={session} 
                        key={pun.id}
                        deletePost={deletePost}
                        pun={pun} />
                ))
            }
            </div>
        </div>
        </main>
    </>
  )
}

export async function getServerSideProps(context) {

  const session = await getServerSession(context.req, context.res, authOptions)
  
    //get posts from prisma
    
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
            // likes: obj.likes.length,
            // comments: obj.comments.length
        }
    })
  
    if (!session) {
        //redirect to login page
        return {
        redirect: {
            destination: "/",
            permanent: false,
        },
        }
    }

    return {
        props: {
        session,
        posts: transformedArray
        },
    }
}



