import { prisma } from "../../../../server/db/client";

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const posts = await prisma.post.findMany({
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
        res.json(posts)
    } else if (req.method === 'POST') {
        const newPost = await prisma.post.create({
            data: {

                // model Post {
                //     id        Int      @id @default(autoincrement())
                //     createdAt DateTime @default(now())
                //     updatedAt DateTime @updatedAt
                //     caption    String
                //     image      String
                //     comments   Comments[]
                //     likes      Likes[]
                //     author    User     @relation(fields: [authorId], references: [id])
                //     authorId  String
                //     tags      Tags[]
                //   }
        
                authorId: req.body.authorId,
                caption: req.body.caption,
                image: req.body.image,
                tags: req.body.tags
            }
        })
        res.json(newPost)
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        )
    }
}
