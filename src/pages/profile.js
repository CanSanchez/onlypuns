import { useSession, signIn, signOut } from "next-auth/react";
import { authOptions } from './api/auth/[...nextauth]'
import { getServerSession } from "next-auth";
import Image from "next/image";

export default function Component() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Image width={20} height={20} src={session.user.image}  alt={session.user.name}/> <br />
        {session.user.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    //redirect to login page
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
