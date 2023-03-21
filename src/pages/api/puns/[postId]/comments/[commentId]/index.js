import { prisma } from '../../../../../../../server/db/client'

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const comment = await prisma.comments.findUnique({
            where: {
                id: parseInt(req.query.commentId)
            },
            include: {
                author: true
            }
        })
        res.json(comment)
    } else if (req.method === 'DELETE') {

        console.log(req.query.commentId)
            
            // if delete, delete post in prisma
           await prisma.comments.delete({
                where: {
                    id: parseInt(req.query.commentId)
                },
            })
            res.status(204).end()
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        )
    }
}