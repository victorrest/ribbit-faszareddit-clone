import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";

import { v4 as uuidv4 } from "uuid";

import { putSinglePost } from "@/store";
import "react-quill/dist/quill.snow.css";
import "./CreatePost/PostForm.css";

const ReactQuill = React.lazy(() => import("react-quill"));
const modules = {
  keyboard: {
    bindings: {
      tab: {
        key: 9,
        handler: function (range, context) {
          return true;
        },
      },
    },
  },
  toolbar: [
    [
      "bold",
      "italic",
      "link",
      "strike",
      "code",
      { script: "super" },
      { header: 1 },
    ],
    [{ list: "bullet" }, { list: "ordered" }],
    ["blockquote", "code-block"],
  ],
};

export function UpdatePost() {
  const { postId } = useParams();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const post = useAppSelector((state) => state.posts.posts[+postId]);

  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [titleErrors, setTitleErrors] = useState([]);
  const [contentErrors, setContentErrors] = useState([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (title?.trim().length === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [dispatch, title, content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let titles = [];
    let contents = [];

    if (title && title.trim().length < 1)
      titles.push("Please give your post a title.");
    if (titles.length > 0 || contents.length > 0) {
      setTitleErrors(titles);
      setContentErrors(contents);
    } else {
      dispatch(putSinglePost({ title: title, content: content }, post?.id));
      history.push(`/posts/${postId}`);
    }
  };

  return (
    <div className="update-post-form-container">
      <div className="update-post-form-header">Update post</div>
      <form className="update-post-form" onSubmit={handleSubmit}>
        <div className="update-post-form-input">
          <textarea
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Title"
            maxLength={300}
          ></textarea>
          {titleErrors.length > 0 &&
            titleErrors.map((error) => (
              <div key={uuidv4()} className="update-post-errors">
                {error}
              </div>
            ))}
          <div className="update-title-length">{title?.length}/300</div>
        </div>
        <div className="update-post-form-input">
          <ReactQuill
            theme="snow"
            modules={modules}
            onChange={setContent}
            placeholder="Content"
            value={content}
          />
          {contentErrors.length > 0 &&
            contentErrors.map((error) => (
              <div key={uuidv4()} className="update-post-errors">
                {error}
              </div>
            ))}
        </div>
        <div className="update-post-form-buttons">
          <button
            className="update-post-cancel"
            onClick={() => history.push(`/posts/${postId}`)}
          >
            Cancel
          </button>
          <button
            className="update-post-submit"
            disabled={disabled}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
