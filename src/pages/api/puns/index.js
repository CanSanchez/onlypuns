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


 



// Here's an updated version of the formatTags() function that returns the correct array of objects:


// function formatTags(tags) {
//   const tagObjects = tags.map(tagName => {
//     return {
//       create: {
//         name: tagName
//       }
//     }
//   });
//   return tagObjects;
// }

// This should fix the error you are seeing. Let me know if you have any further questions!