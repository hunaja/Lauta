import React from "react";
import Helmet from "react-helmet";
import { Navigate } from "react-router";

import useStore from "../../use_auth";

import LoginForm from "./form";
import FrontPageBox from "../box";
import FrontPageBoxHeader from "../box_header";
import FrontPageLayout from "../layout";

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
