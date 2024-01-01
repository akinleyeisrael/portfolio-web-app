// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

// export default withAuth ({
//     callbacks: {
//         authorized:({token}) =>{
//           !!token?.role ==="admin"
//         }
//     }
// })

// export default withAuth({
//     pages: {
//         signOut: "/",
//     },
// });

// export const config = { matcher: ['/admin/:path*'] }