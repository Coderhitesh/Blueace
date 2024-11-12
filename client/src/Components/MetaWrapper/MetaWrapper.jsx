import React, { useEffect } from "react";

const MetaWrapper = ({ title, description, children }) => {
  useEffect(() => {
    // Set the meta title
    document.title = title || "Your Default Title";

    // Set the meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description || "Your default description");
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = description || "Your default description";
      document.head.appendChild(newMetaDescription);
    }
  }, [title, description]);

  return <>{children}</>;
};

export default MetaWrapper;
