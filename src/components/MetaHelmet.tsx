import React from "react";
import { Helmet } from "react-helmet";
import { APP_NAME, APP_URL } from "../utils/constant";

interface MetaHelmetProps {
  pageTitle?: string;
  description?: string;
  canonical?: string;
}

const MetaHelmet: React.FC<MetaHelmetProps> = ({
  pageTitle = "Home",
  description = `Welcome to ${APP_NAME}. Start or join a live cricket match and track scores easily.`,
  canonical = "/",
}) => (
  <Helmet>
    <title>
      {APP_NAME} | {pageTitle}
    </title>
    <meta name="description" content={description} />
    <link rel="canonical" href={`${APP_URL}${canonical}`} />
  </Helmet>
);

export default MetaHelmet;
