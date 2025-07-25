import React, { useEffect, useMemo, useState } from "react";
import { SearchResults } from "@/pages";
import { useSearchQuery } from "../../../hooks/useSearchQuery";
import { SearchResultsSortBtn } from "../SearchResultsSorting/SearchResultsSort";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPosts, searchComments } from "@/store";
import { CommentResult } from "./CommentResult";
import { NoResults } from "../NoResults";
import { focusSearchbar } from "../../../utils/focusSearchbar";
import CommentResultType from "./CommentResultType";
import { sortCommentResults } from "features/NewSearch/utils/sortCommentResults";

export function SearchResultsComments({ searchbarRef }) {
  const dispatch = useAppDispatch();
  const query = useSearchQuery();

  const rawComments = useAppSelector((s) => Object.values(s.search.comments));

  const [sortMode, setSortMode] = useState("Top");
  const [isLoading, setIsLoading] = useState(false);
  const postsLoaded = useAppSelector((state) => state.posts.loaded);
  useEffect(() => {
    setIsLoading(true);
    if (!postsLoaded) dispatch(getPosts());
    dispatch(searchComments(query)).finally(() => setIsLoading(false));
  }, [query, dispatch]);

  const focusSearchBox = () => {
    focusSearchbar(searchbarRef);
  };

  const comments = useMemo(
    () => sortCommentResults(rawComments, sortMode),
    [rawComments, sortMode]
  );

  return (
    <SearchResults query={query} searchPage="Comments">
      <SearchResultsSortBtn
        searchPage="Comments"
        sort={sortMode}
        setSort={setSortMode}
      />
      <div className="search-results">
        <div className="search-results-page-comments">
          <CommentResultType
            isLoading={isLoading}
            comments={comments}
            query={query}
            focusSearchBox={focusSearchBox}
          />
        </div>
      </div>
    </SearchResults>
  );
}
