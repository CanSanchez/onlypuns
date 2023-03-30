import { prisma } from "../../../../../../server/db/client";

export default async function handler(req, res) {
    const { postId } = req.query;
    
    if (req.method === "GET") {
        const comments = await prisma.comments.findMany({
        where: {
            postId: parseInt(postId),
        }
        });
        res.json(comments.sort((a, b) => b.createdAt - a.createdAt));
    } else if (req.method === "POST") {
    
        const newComment = await prisma.comments.create({
            data: {
                text: req.body.text,
                post: {
                    connect: {
                        id: parseInt(postId),
                    }
                },
                author: {
                    connect: {
                        email: req.body.authorId,
                    }
                },
            },
            include: {
                author: true,
            }
        });
        res.json(newComment);
    }
}