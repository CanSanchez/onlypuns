import { prisma } from '../../../../../server/db/client'

export default async function handler(req, res) {

    // if get, get single post from prisma
    if (req.method === 'GET') {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(req.query.postId)
            },
            include: {
                tags: true,
                likes: true,
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                }
            }
        })
        res.json(post)
    } else if (req.method === 'PUT') {

        // if put, update post in prisma
        const updatedPost = await prisma.post.update({
            where: {
                id: parseInt(req.query.postId)
            },
            data: {
                caption: req.body.caption,
                image: req.body.image,
                tags: req.body.tags
            },
            include: {
                tags: true,
                likes: true,
            }
        })
        res.json(updatedPost)
    } else if (req.method === 'DELETE') {

        console.log(req.query.postId)
            
            // if delete, delete post in prisma
           await prisma.post.delete({
                where: {
                    id: parseInt(req.query.postId)
                },
                include: {
                    tags: true,
                    likes: true,
                }
            })
            res.status(204).end()

    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        )
    }
}