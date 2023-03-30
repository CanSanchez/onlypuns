import React, { useEffect } from "react";
import Head from "next/head";
import NavBar from "../../../components/navbar";
import AddPost from "../../../components/addpost";
import PunCard from "../../../components/puns";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { prisma } from "../../../server/db/client";
import Loading from "../../../components/loading";


export default function Puns({ pun }) {

    const [activePun, setActivePun] = useState(pun)

    console.log(activePun)

    //loading
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();

        //delete post using prisma
        const deletePost = async (id) => {
            setLoading(true)
            try {
             const res = await fetch(`/api/puns/${id}`, {
                    method: 'DELETE'
             })
             router.push('/puns')
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
                 router.push(`/puns`)
                 
             } catch (error) {
                 console.log(error)
             }
            setTimeout(() => {  
                setLoading(false)
            }
            , 1000)
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
           setActivePun(data)
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
                //  update active pun state
                setActivePun({...activePun, comments: [data, ...activePun.comments]})
             } catch (error) {
                 console.log(error)
             }
         }
     
         //delete comment using prisma
         const deleteComment = async (id, postId) => {
            console.log(id, postId)
             try {
                 const res = await fetch(`/api/puns/${postId}/comments/${id}`, {
                     method: 'DELETE'
                 })
                const data = await res.json()
                // update active pun state
                setActivePun({...activePun, comments: activePun.comments.filter(comment => comment.id !== id)})
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
                // update active pun state
                setActivePun({...activePun, likes: [data, ...activePun.likes]})
             } catch (error) {
                 console.log(error)
             }
         }

        useEffect(() => {
        }, [activePun])

    return (
        <>
            <Head>
                <title>OnlyPuns</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/onlypuns.png" />
            </Head>
            <main className='max-w-screen min-h-full'>
                <NavBar session={session} addPost={addPost}/>
                {loading && <Loading />}
                <div className="flex flex-col items-center justify-center min-h-screen max-w-screen py-4 pt-24 my-4">
                    <div className="flex flex-col items-center justify-center min-h-full w-6/12 py-2 tablet:w-9/12 mobile:w-screen">
                            <PunCard
                                updatePost={updatePost}
                                deleteComment={deleteComment}
                                addLike={addLike}
                                addComment={addComment}
                                session={session} 
                                key={pun.id}
                                deletePost={deletePost}
                                pun={activePun} />
                    </div>
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps(context) {

    const session = await getServerSession(context.req, context.res, authOptions)

    const postId = context.query.postId;
   
    const post = await prisma.post.findUnique({
        where: {
            id: Number(postId)
        },
        include: {
            tags: true,
            likes: true,
            comments: {
                include: {
                    author: true,
                }
            },
            author: true,
        }
    })

    return {
        props: {
            session,
            pun: JSON.parse(JSON.stringify(post)),
        },
    };
}