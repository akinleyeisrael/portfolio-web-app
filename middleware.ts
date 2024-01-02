// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

// export default withAuth ({
//     callbacks: {
//         authorized:({token}) =>{
//           !!token?.role ==="admin"
//         } 
//     }
// })

export default withAuth({
    secret: process.env.NEXTAUTH_SECRET,
});
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface CustomRequestCookies extends RequestCookies {
    auth?: string;
}

export const middleware = (req: NextRequest) => {
    const cookies = req.cookies as CustomRequestCookies;
    const authCookie = cookies["auth"];

    if (!authCookie) {
        return NextResponse.redirect("/login");
    }

    return NextResponse.next();
};
export const config = { matcher: ['/admin/:path*'] }