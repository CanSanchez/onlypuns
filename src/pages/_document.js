import { Html, Head, Main, NextScript } from 'next/document'
import { Helmet } from 'react-helmet'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Helmet>
        <link rel="preload" href="http://localhost:3000/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjhxv0heo%2Fimage%2Fupload%2Fv1679412493%2Fzzzkysnamhnd5uh97tw8.jpg&w=828&q=75" as="image" />
        <meta name="description" content="Onlypuns: A place for puns and fun." />
      </Helmet>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
