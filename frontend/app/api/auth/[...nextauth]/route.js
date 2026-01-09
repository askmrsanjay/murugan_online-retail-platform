import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: "nextjs-frontend",
            clientSecret: "unused-public-client",
            issuer: "http://keycloak:8080/realms/retail-realm",
            wellKnown: undefined, // Disable auto-discovery to avoid hostname mismatches
            authorization: {
                url: "http://localhost:8081/realms/retail-realm/protocol/openid-connect/auth",
                params: { scope: "openid email profile" }
            },
            token: "http://keycloak:8080/realms/retail-realm/protocol/openid-connect/token",
            userinfo: "http://keycloak:8080/realms/retail-realm/protocol/openid-connect/userinfo",
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
    secret: "some-random-secret-key-change-me",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
