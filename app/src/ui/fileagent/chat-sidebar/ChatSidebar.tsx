import clsx from "clsx";
import { useEffect, useState } from "react";
import { filesize } from "filesize";

import { useChatSidebarContext } from "context/chat-sidebar/useChatSidebarContext";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useAuthorizationContext } from "context/authorization/useAuthorizationContext";
import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";
import { ChatContextMessage } from "context/message/MessageContext.types";
import { LocalStorageKeys } from "hooks/useLocalStorage/useLocalStorage.types";
import { useMessageContext } from "context/message/useMessageContext";
import { useFileContext } from "context/file/useFileContext";

import { ChatSidebarProps } from "./ChatSidebar.types";
import styles from "./ChatSidebar.module.scss";

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ className }) => {
  const [threads, setThreads] = useState<ChatContextMessage[][]>([]);

  const authContext = useAuthorizationContext();

  const chatSidebarContext = useChatSidebarContext();

  const messageContext = useMessageContext();

  const fileContext = useFileContext();

  const ls = useLocalStorage();

  useEffect(() => {
    setThreads(ls.get<ChatContextMessage[][]>(LocalStorageKeys.threads) || []);
  }, [chatSidebarContext.isOpen]);

  useEffect(() => {
    fileContext.getUserFiles();
  }, [chatSidebarContext.isOpen]);

  return (
    <>
      {chatSidebarContext.isOpen && (
        <div
          className={styles["chat-sidebar__dismiss-overlay"]}
          onClick={chatSidebarContext.close}
          role="button"
          tabIndex={-1}
          onKeyPress={() => undefined}
          aria-label="Dismiss overlay"
        />
      )}
      <div
        className={clsx(styles["chat-sidebar"], className, {
          [styles["chat-sidebar__open"]]: chatSidebarContext.isOpen,
          [styles["chat-sidebar__closed"]]: !chatSidebarContext.isOpen,
        })}
      >
        <div className={styles["chat-sidebar__header"]}>
          <Icon
            name="icon-cross-circle"
            onClick={chatSidebarContext.toggle}
            className={styles["chat-sidebar__header--toggle"]}
          />
        </div>
        <section id="files">
          <Typography.Headline6>
            <Icon name="icon-chevron-right" /> Files
          </Typography.Headline6>
          <div className={styles["chat-sidebar__files"]}>
            {fileContext.userFiles.map((item) => (
              <div className={styles["chat-sidebar__file--item"]} key={item.id}>
                <Typography.Text flat truncate>
                  {item.name}
                </Typography.Text>
                <div className={styles["chat-sidebar__file--item-options"]}>
                  <Typography.MiniDescription flat>
                    {filesize(item.metadata.size)} — <span>Inquire</span> · <span>Download</span> · <span>Share</span> ·{" "}
                    <span>Delete</span>
                  </Typography.MiniDescription>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="authorizations">
          <Typography.Headline6>
            <Icon name="icon-chevron-right" /> Authorizations
          </Typography.Headline6>
          {authContext.authItems.map((item) => (
            <div className={styles["chat-sidebar__file--item"]} key={item.name.trim()}>
              <Typography.Text flat>{item.name}</Typography.Text>
              <div className={styles["chat-sidebar__file--item-options"]}>
                <Typography.MiniDescription flat>
                  {item.isAuthorized ? "Authorized" : <span>Authorize</span>}
                </Typography.MiniDescription>
              </div>
            </div>
          ))}
        </section>
        {threads.length && (
          <section id="threads">
            <Typography.Headline6>
              <Icon name="icon-chevron-right" /> Threads
            </Typography.Headline6>
            {threads.map((item, index) => (
              <div
                className={styles["chat-sidebar__thread--item"]}
                key={item[0].id}
                onClick={() => messageContext.loadMessageThread(index)}
                role="button"
                tabIndex={0}
                onKeyPress={() => undefined}
              >
                <Typography.Text flat truncate>
                  {item[1].content}
                </Typography.Text>
              </div>
            ))}
          </section>
        )}
      </div>
    </>
  );
};
