import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../contex/user.context";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import axios from "../config/axios";
import { getWebContainer } from "../config/webcontainer";
import hljs from "highlight.js";
import Markdown from "markdown-to-jsx";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set()); // Initialized as Set
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = React.createRef();

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]); // New state variable for messages
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);

  const [runProcess, setRunProcess] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const send = () => {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
    setMessage("");
  };

  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message);

    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    initializeSocket(project._id);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("container started");
      });
    }

    receiveMessage("project-message", (data) => {
      console.log(data);

      // Check if the message already exists
      setMessages((prevMessages) => {
        const exists = prevMessages.some(
          (m) => m.sender._id === data.sender._id && m.message === data.message
        );
        if (exists) return prevMessages; // Skip duplicate

        // AI-specific handling
        if (data.sender._id === "ai") {
          try {
            const messageObj = JSON.parse(data.message);
            webContainer?.mount(messageObj.fileTree);
            if (messageObj.fileTree) setFileTree(messageObj.fileTree || {});
          } catch (err) {
            console.log("Error parsing AI message:", err);
          }
        }

        return [...prevMessages, data]; // Add new message
      });
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project);

        setProject(res.data.project);
        setFileTree(res.data.project.fileTree || {});
      });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Removed appendIncomingMessage and appendOutgoingMessage functions

  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }
  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTo({
        top: messageBox.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
     <main className="h-screen w-screen flex overflow-hidden bg-gray-50">
      {/* Chat Section */}
      <section className="relative flex flex-col h-full w-full max-w-md bg-white border-r border-gray-200">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-line"></i> Add Collaborators
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-700"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className="ri-group-fill text-lg"></i>
          </button>
        </header>

        {/* Messages */}
        <div className="flex flex-col flex-grow overflow-hidden">
          <div
            ref={messageBox}
            className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50"
          >
            {messages.map((msg, idx) => {
              const isMine = msg.sender?._id === user._id;
              return (
                <div
                  key={idx}
                  className={`flex ${isMine ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-sm break-words ${
                      isMine
                        ? "bg-white border border-gray-200"
                        : "bg-gray-800 text-white"
                    }`}
                    style={{
                      maxWidth: "85%",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <small className={`block text-xs mb-1 ${isMine ? "text-gray-500" : "text-gray-300"}`}>
                      {msg.sender?.email || "Unknown"}
                    </small>
                    <div className="text-sm">
                      {msg.sender._id === "ai" ? (
                        WriteAiMessage(msg.message)
                      ) : (
                        <p className={isMine ? "text-gray-800" : "text-white"}>{msg.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-4 flex items-center gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && send()}
              type="text"
              placeholder="Type a message..."
              className="flex-grow p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
            <button
              onClick={send}
              className="px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div
          className={`absolute top-0 h-full max-w-xs w-full bg-white shadow-xl transition-transform border-r border-gray-200 z-10 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-800">Collaborators</h1>
            <button onClick={() => setIsSidePanelOpen(false)} className="text-gray-500 hover:text-gray-800">
              <i className="ri-close-line text-xl"></i>
            </button>
          </header>
          <div className="p-3 flex flex-col gap-2 overflow-y-auto">
            {project.users?.map((usr) => (
              <div
                key={usr._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-full">
                  <i className="ri-user-fill"></i>
                </div>
                <p className="text-sm text-gray-700">{usr.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Editor Section */}
      <section className="flex-grow h-full flex bg-white">
        {/* File Explorer */}
        <div className="h-full w-64 bg-gray-50 border-r border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Files</h2>
          </div>
          <div className="w-full">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log("Clicked file:", file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                  setCurrentFile(file);
                }}
                className="w-full p-3 px-4 flex items-center gap-2 hover:bg-gray-100 border-b border-gray-100 transition-colors text-left"
              >
                <i className="ri-file-code-line text-gray-600"></i>
                <p className="font-medium text-sm text-gray-700">{file}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex flex-col flex-grow h-full">
          {/* Tabs */}
          <div className="flex items-center bg-gray-50 border-b border-gray-200">
            <div className="flex flex-grow overflow-x-auto">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFile(file)}
                  className={`px-4 py-3 text-sm font-medium border-r border-gray-200 whitespace-nowrap transition-colors ${
                    currentFile === file
                      ? "bg-white text-gray-800 border-b-2 border-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>
            <div className="flex gap-2 px-3 border-l border-gray-200">
              <button
                onClick={async () => {
                  await webContainer.mount(fileTree);
                  const installProcess = await webContainer.spawn("npm", ["install"]);
                  installProcess.output.pipeTo(
                    new WritableStream({
                      write(data) {
                        console.log(data);
                      },
                    })
                  );
                  if (runProcess) {
                    runProcess.kill();
                  }

                  let tempRunprocess = await webContainer.spawn("npm", ["start"]);

                  tempRunprocess.output.pipeTo(
                    new WritableStream({
                      write(data) {
                        console.log(data);
                      },
                    })
                  );
                  setRunProcess(tempRunprocess);

                  webContainer.on("server-ready", (port, url) => {
                    console.log(port, url);
                    setIframeUrl(url);
                  });
                }}
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors"
              >
                <i className="ri-play-fill mr-1"></i>
                Run
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex flex-grow overflow-hidden">
            <div className="flex-grow">
              {fileTree[currentFile] && (
                <textarea
                  className="w-full h-full bg-gray-900 text-gray-100 p-4 font-mono text-sm outline-none resize-none"
                  value={fileTree[currentFile]?.file?.contents || ""}
                  onChange={(e) => {
                    setFiletree({
                      ...fileTree,
                      [currentFile]: {
                        ...fileTree[currentFile],
                        file: {
                          ...fileTree[currentFile].file,
                          contents: e.target.value,
                        },
                      },
                    });
                  }}
                  spellCheck="false"
                ></textarea>
              )}
            </div>

            {/* Preview Panel */}
            {iframeUrl && webContainer && (
              <div className="flex flex-col h-full w-96 border-l border-gray-200 bg-white">
                <div className="bg-gray-50 border-b border-gray-200 p-2">
                  <input
                    onChange={(e) => setIframeUrl(e.target.value)}
                    type="text"
                    value={iframeUrl}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  />
                </div>
                <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Collaborator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-md relative">
            <header className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add Collaborators</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </header>

            <div className="p-4 max-h-96 overflow-auto">
              {users.map((usr) => (
                <div
                  key={usr._id}
                  onClick={() => handleUserClick(usr._id)}
                  className={`cursor-pointer p-3 flex items-center gap-3 rounded-lg mb-2 transition-colors ${
                    selectedUserId.has(usr._id)
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      selectedUserId.has(usr._id)
                        ? "bg-white text-gray-800"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    <i className="ri-user-fill"></i>
                  </div>
                  <h1 className="text-sm font-medium">{usr.email}</h1>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCollaborators}
                className="px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
