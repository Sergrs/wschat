import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultUser['user']

  }


}

declare module "next-auth/jwt" {
  interface JWT {
    token: {
      id: string;
      email: string;
    }

  }
}


// import NextAuth from "next-auth"

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       /** The user's postal address. */
//       id: string,
//       email: string,
//       username: string,
//     } & DefaultSession['user']
//   }
//   interface User {
//     user: {
//       /** The user's postal address. */
//       id: string,
//       email: string,
//       username: string,
//     } & DefaultUser['user']
//   }

// }
