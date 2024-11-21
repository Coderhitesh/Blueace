// src/components/MetaTag.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const MetaTag = ({ title, description, keyword, focusKeywords }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keyword} />
      <meta name="focus-keywords" content={focusKeywords} />
    </Helmet>
  );
};

// Add propTypes for validation
MetaTag.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  focusKeywords: PropTypes.string,
};

// Optional defaultProps to avoid undefined values
MetaTag.defaultProps = {
  focusKeywords: '',
};

export default MetaTag;
