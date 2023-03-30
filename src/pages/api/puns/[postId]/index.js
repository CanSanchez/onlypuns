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
                comments: {
                    include: {
                        author: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
            }
        })
        res.json(post)
        console.log(post)
    } else if (req.method === 'PUT') {

        // if put, update post in prisma
        await prisma.tags.deleteMany({
            where: {
                postId: parseInt(req.query.postId)
            }
        })

        const tags = req.body.tags
        const formatTags = tags.map(tag => {
            return {
                tag: tag
            }
        })

        const updatedPost = await prisma.post.update({

            
            where: {
                id: parseInt(req.query.postId)
            },
            data: {
                caption: req.body.caption,
                image: req.body.image,
                tags: {
                    createMany: {
                        data: formatTags
                    }
                }
            },
            include: {
                tags: true,
                likes: true,
                comments: true,
                author: true
            }
        })
        res.json(updatedPost)
    } else if (req.method === 'DELETE') {

        console.log(req.query.postId)
            
            // if delete, delete post in prisma
           await prisma.post.findUnique({
                where: {
                    id: parseInt(req.query.postId)
                },
                include: {
                    comments: true,
                    likes: true,
                    tags: true
                }
            })

            await prisma.comments.deleteMany({
                where: {
                    postId: parseInt(req.query.postId)
                }
            })

            await prisma.likes.deleteMany({
                where: {
                    postId: parseInt(req.query.postId)
                }
            })

            await prisma.tags.deleteMany({
                where: {
                    postId: parseInt(req.query.postId)
                }
            })

            await prisma.post.delete({
                where: {
                    id: parseInt(req.query.postId)
                },
            })
            res.status(204).end()

    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        )
    }
}