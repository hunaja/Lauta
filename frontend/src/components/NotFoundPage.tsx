import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";

import FrontPageBox from "./FrontPageBox";
import FrontPageBoxHeader from "./FrontPageBoxHeader";
import FrontPageLayout from "./FrontPageLayout";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <>
            <Helmet>
                <title>Ei löytynyt</title>
            </Helmet>

            <FrontPageLayout>
                <FrontPageBox>
                    <FrontPageBoxHeader>
                        <h3>Pahus, 404!</h3>
                        <div className="text-xs text-purple-400">
                            <button
                                className="underline mr-2 hover:text-purple-500"
                                type="button"
                                onClick={() => goBack()}
                            >
                                <ArrowNarrowLeftIcon className="inline-block h-3 w-3" />
                                Palaa Takaisin
                            </button>
                        </div>
                    </FrontPageBoxHeader>

                    <p>Huh huh! Tällaista sivua ei kyllä ole olemassa.</p>
                </FrontPageBox>
            </FrontPageLayout>
        </>
    );
}
