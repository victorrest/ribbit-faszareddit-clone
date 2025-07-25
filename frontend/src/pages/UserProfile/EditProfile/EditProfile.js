import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useHistory } from "react-router-dom";
import { editProfile, getUsers } from "@/store";
import { usePageSettings } from "@/hooks/usePageSettings";
import "./EditProfile.css";
import { useIsMobile } from "hooks/useIsMobile";

export function EditProfile() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const user1 = useAppSelector((state) => state.session.user);
  const user = useAppSelector((state) => state.users[user1.id]);

  const [display_name, setdisplay_name] = useState(user?.displayName);
  const [about, setAbout] = useState(user?.about);

  const isMobile = useIsMobile();

  usePageSettings({
    documentTitle: "User Settings",
    icon: (
      <img
        src={user1?.profileImg}
        className="nav-left-dropdown-item-icon item-icon-circle"
        alt="User"
      />
    ),
    pageTitle: "User Settings",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = dispatch(editProfile(user?.id, { display_name, about }));
    if (data.length > 0) {
    } else {
      history.push(`/users/${user?.id}/profile`);
    }
  };

  return (
    <div className={`edit-profile-page${isMobile ? " mobile" : ""}`}>
      <form onSubmit={handleSubmit}>
        <h1>User Profile Settings</h1>
        <div className="edit-profile-page-section">
          <h2>Display name (optional)</h2>
          <p>Set a display name. This does not change your username.</p>
          <input
            className="community-name-input"
            type="text"
            maxLength={30}
            value={display_name}
            onChange={(e) => setdisplay_name(e.target.value)}
          />
          <span
            className={
              display_name?.length === 30
                ? "user-profile-char-counter red-counter"
                : "user-profile-char-counter"
            }
          >
            {30 - display_name?.length} Characters remaining
          </span>
        </div>
        <div className="edit-profile-page-section">
          <h2>About (optional)</h2>
          <p>A brief description of yourself shown on your profile.</p>
          <textarea
            className="user-profile-about-input"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            maxLength={200}
          ></textarea>
          <span
            className={
              about?.length === 200
                ? "user-profile-char-counter red-counter"
                : "user-profile-char-counter"
            }
          >
            {200 - about?.length} Characters remaining
          </span>
        </div>
        <div className="edit-profile-btns">
          <button
            className="cancel-profile-edit"
            onClick={() => history.push(`/users/${user?.id}/profile`)}
          >
            Cancel
          </button>
          <button className="submit-profile-edit" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
