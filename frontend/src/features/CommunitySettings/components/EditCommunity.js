import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { useHistory, NavLink, useParams, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  updateCommunity,
  getCommunityRules,
  getSingleCommunity,
  deleteCommunity,
  getCommunities,
} from "@/store";
import { Modal } from "@/context";
import { DeleteConfirmationModal, CommunityImg } from "@/components";
import { getIdFromName } from "@/utils/getCommunityIdFromName";
import { CommunityEditRule, AddCommunityRuleModal } from "@/features";
import "../CommunitySettings.css";

export function EditCommunity() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { communityName } = useParams();
  const communities = useAppSelector((state) => state.communities.communities);
  const currentUser = useAppSelector((state) => state.session.user);
  const communityId = getIdFromName(communityName, communities);

  const user = useAppSelector((state) => state.session.user);
  const community = useAppSelector(
    (state) => state.communities.communities[+communityId]
  );
  const rules = useAppSelector((state) => Object.values(state.rules));

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [addAllowed, setAddAllowed] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rulesNum, setRulesNum] = useState(0);
  const [displayName, setDisplayName] = useState(community?.displayName);
  const [description, setDescription] = useState(community?.description);

  useEffect(() => {
    dispatch(getCommunityRules(communityId));
    dispatch(getSingleCommunity(communityId));
    dispatch(getCommunities());
  }, [community?.id, communityId, dispatch]);

  useEffect(() => {
    if (rules.length === 15) {
      setAddAllowed(false);
    }
    if (rules.length < 15) {
      setAddAllowed(true);
    }
  }, [rules.length, addAllowed, rules]);

  useEffect(() => {
    setDescription(community?.description);

    setRulesNum(rules.length);
  }, [rulesNum, community?.description, rules.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await dispatch(
      updateCommunity({ displayName, description }, community?.id)
    );
    await dispatch(getCommunities());

    history.push(`/c/${data.name}`);
  };

  const handleDeleteCommunity = async () => {
    await dispatch(deleteCommunity(communityId));
    history.push(`/`);
  };

  useEffect(() => {
    if (community?.communityOwner.id !== currentUser?.id) {
      history.push(`/c/${communityName}`);
    }
  }, []);

  // if (!community || !community) return null;
  return (
    <div className="edit-community-page">
      <div className="edit-community-page-header">
        <div className="edit-community-top-bar">
          <CommunityImg
            imgStyle={{
              backgroundColor: `${
                community?.communitySettings[community.id].baseColor
              }`,
            }}
            imgSrc={community?.communitySettings[community.id].communityIcon}
            imgAlt="Community"
          />
          <span className="edit-community-top-bar-name">
            <NavLink to={`/c/${communityName}`}>c/{community?.name}</NavLink> /
            Community Settings
          </span>
        </div>
        <div className="edit-community-save-bar">
          <button className="blue-btn-filled btn-short" onClick={handleSubmit}>
            Save changes
          </button>
        </div>
      </div>
      <div className="edit-community-page-settings">
        {user.id === community?.userId && (
          <>
            <h1>Community settings</h1>
            <Link to={`/c/${communityName}/style`}>Style</Link>

            <div className="edit-community-page-section">
              <h2>Community display name (optional)</h2>
              <p className="community-description-details">
                If input field below is empty, your display name will be your
                community name.
              </p>
              <input
                className="community-name-input"
                type="text"
                maxLength={100}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <span
                className={
                  displayName?.length === 100
                    ? "community-name-char-counter red-counter"
                    : "community-name-char-counter"
                }
              >
                {100 - displayName?.length} Characters remaining
              </span>
            </div>
            <div className="edit-community-page-section">
              <h2>Community description (optional)</h2>
              <p className="community-description-details">
                This is how new members come to understand your community?.
              </p>
              <textarea
                className="community-description-input"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                maxLength={500}
              ></textarea>
              <span
                className={
                  description?.length === 500
                    ? "community-description-char-counter red-counter"
                    : "community-description-char-counter"
                }
              >
                {500 - description?.length} Characters remaining
              </span>
            </div>
            <div className="edit-community-page-section">
              <h2>Community rules (optional)</h2>
              <p className="community-description-details">
                These are rules that visitors must follow to participate.
                Communities can have a maximum of 15 rules.
              </p>
              <div className="community-rules-container">
                <div className="community-rules-button-bar">
                  <button
                    disabled={rulesNum >= 15}
                    className="blue-btn-filled btn-short"
                    onClick={() => setShowRuleModal(true)}
                  >
                    Add rule
                  </button>
                </div>
                <div className="community-rules-edit">
                  {Object.values(community?.communityRules).map((rule, idx) => (
                    <CommunityEditRule
                      key={uuidv4()}
                      community={community}
                      idx={idx}
                      rule={rule}
                    />
                  ))}
                </div>
              </div>
              {showRuleModal && (
                <Modal
                  close={showRuleModal}
                  onClose={() => setShowRuleModal(false)}
                  title="Add rule"
                  open={() => setShowRuleModal(true)}
                >
                  <AddCommunityRuleModal
                    communityId={communityId}
                    setShowRuleModal={setShowRuleModal}
                    communityName={communityName}
                  />
                </Modal>
              )}
            </div>
            <div className="edit-community-page-section">
              <h2>Delete Community</h2>
              <p className="community-description-details">
                Click the button below to delete this community. Please note
                that once you confirm deletion, you cannot undo this action.
              </p>
              <button
                className="delete-community-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete c/{community?.name}
              </button>
              {showDeleteModal && (
                <Modal
                  close={showDeleteModal}
                  onClose={() => setShowDeleteModal(false)}
                  title={`Delete community c/${community?.name}?`}
                  open={() => setShowDeleteModal(true)}
                >
                  <DeleteConfirmationModal
                    setShowDeleteModal={setShowDeleteModal}
                    showDeleteModal={showDeleteModal}
                    item="community"
                    handleDelete={handleDeleteCommunity}
                  />
                </Modal>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
