// src/components/MetaTag.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTag = ({ title, description, keyword, focus }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keyword} />
      <meta name="focus-keywords" content={focus} />
    </Helmet>
  );
};

export default MetaTag;