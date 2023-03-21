import { prisma } from "../../../../server/db/client";

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const posts = await prisma.post.findMany({
            include: {
                tags: {
                    where: {
                        tagged: true
                    }
                },
                likes: {
                    where: {
                        liked: true
                    }
                },
                author: true,
                comments: {
                    where: {
                        commented: true
                    },
                    include: {
                        author: true
                    }
                }
            }
        })
        res.json(posts)
    } else if (req.method === 'POST') {

        function formatTags(tags) {
            const tagObjects = tags.map(tagName => {
                return {
                    tag: tagName
                }
            });
            return tagObjects;
        }

        const formattedTags = formatTags(req.body.tags)

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
                caption: req.body.caption,
                image: req.body.image,
                tags: {
                    createMany: {
                        data: formattedTags
                    }
                },
                author: {
                    connect: {
                        email: req.body.authorId,
                    }
                }
            }
        })
        res.json(newPost)
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        )
    }
}
