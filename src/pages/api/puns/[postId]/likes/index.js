import { prisma } from "../../../../../../server/db/client";


export default async function handler(req, res) {

    if (req.method === 'GET') {
        const likes = await prisma.likes.findMany({
            where: {
                postId: parseInt(req.query.postId)
            },
            include: {
                author: true,
                post: true
            }
        })
        res.json(likes)
    } else if (req.method === 'POST') {

        const newLike = await prisma.likes.create({
            data: {
                post: {
                    connect: {
                        id: parseInt(req.query.postId)
                    }
                },
                author: {
                    connect: {
                        email: req.body.authorId
                    }
                }
            }
        })
        res.json(newLike)
    } 
}