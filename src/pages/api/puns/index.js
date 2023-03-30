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
            },
            include: {
                tags: true,
                author: true,
                comments: true,
                likes: true
            }
        })
        res.json(newPost)
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        )
    }
}
