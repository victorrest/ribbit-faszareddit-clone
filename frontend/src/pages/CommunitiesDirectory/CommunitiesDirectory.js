import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { NavLink } from "react-router-dom";

import { getCommunities } from "@/store";
import { usePageSettings } from "@/hooks/usePageSettings";
import { v4 as uuidv4 } from "uuid";
import "./CommunitiesDirectory.css";

export function CommunitiesDirectory() {
  const dispatch = useAppDispatch();

  const communities = useAppSelector((state) =>
    Object.values(state.communities.communities)
  );
  const communitiesLoaded = useAppSelector((state) => state.communities.loaded);

  useEffect(() => {
    if (!communitiesLoaded) dispatch(getCommunities());
  }, [dispatch]);

  usePageSettings({
    documentTitle: "Communities",
    pageTitle: "Communities Directory",
  });

  return (
    <div className="communities-directory-container">
      <div className="directory-header">
        <h1>Browse communities</h1>
      </div>
      <div className="directory-listings-container">
        {communities
          .sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          )
          .map((community) => (
            <div className="directory-listing" key={uuidv4()}>
              <NavLink to={`/c/${community.name}`}>{community.name}</NavLink>
            </div>
          ))}
      </div>
    </div>
  );
}
