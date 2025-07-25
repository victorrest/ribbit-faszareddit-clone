import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getThreads } from "@/store";
import { MessageHead, SentMessage } from "../..";
import { usePageSettings } from "@/hooks/usePageSettings";
import "./Sent.css";

export function Sent() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.session.user);
  const threads = useAppSelector((state) => Object.values(state.threads));

  useEffect(() => {
    dispatch(getThreads());
  }, [dispatch]);

  usePageSettings({
    documentTitle: "Messages: Sent",
    icon: (
      <img
        src={currentUser?.profileImg}
        className="nav-left-dropdown-item-icon item-icon-circle"
        alt="User"
      />
    ),
    pageTitle: "Messages",
  });

  let sentMessages = threads
    .map((thread) =>
      thread.messages.filter((message) => message.sender.id === currentUser?.id)
    )
    .flat();

  return (
    <div className="messages-page">
      <MessageHead active="Sent" />
      <div className="messages-content">
        <div className="sent-messages">
          {threads.map((thread) =>
            thread.messages
              .filter((message) => message.sender.id === currentUser?.id)
              .map((message, idx) => (
                <SentMessage
                  key={message.id}
                  message={message}
                  firstMessage={idx === 0}
                  recipient={thread.users[0]}
                  threadId={thread.id}
                />
              ))
              .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
          )}
        </div>
        {sentMessages.length === 0 && (
          <div className="messages-content-nothing">
            there doesn't seem to be anything here
          </div>
        )}
      </div>
    </div>
  );
}
