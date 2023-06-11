import React from "react";
import Helmet from "react-helmet";
import { Navigate } from "react-router";

import useStore from "../hooks/useAuthStore";

import LoginForm from "./forms/LoginForm";
import FrontPageBox from "./FrontPageBox";
import FrontPageBoxHeader from "./FrontPageBoxHeader";
import FrontPageLayout from "./FrontPageLayout";

export default function LoginPage() {
    const userAuthenticated = useStore((state) => !!state.authorizedUser);
    if (userAuthenticated) return <Navigate to="/" />;

    return (
        <>
            <Helmet>
                <title>Kirjaudu</title>
            </Helmet>

            <FrontPageLayout>
                <FrontPageBox>
                    <FrontPageBoxHeader>
                        <h3>Kirjaudu sisään</h3>
                    </FrontPageBoxHeader>

                    <LoginForm />
                </FrontPageBox>
            </FrontPageLayout>
        </>
    );
}
