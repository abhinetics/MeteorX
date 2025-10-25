import React, { useState, useEffect, useContext, useRef } from "react";
import Markdown from "markdown-to-jsx";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { getWebContainer } from "../config/WebContainer";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { UserContext } from "../contex/user.context";

const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const messageBox = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [fileTree, setFiletree] = useState({});
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const addCollaborators = async () => {
    try {
      const res = await axios.put("/projects/add-user", {
        projectId: project._id,
        users: Array.from(selectedUserId),
      });
      console.log(res.data);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const send = () => {
    if (!message.trim()) return;
    const newMsg = {
      message,
      sender: { _id: user._id, email: user.email },
    };

    setMessages((prev) => [...prev, newMsg]);
    sendMessage("project-message", newMsg);
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
              // code: SyntaxHighlightedCode,
              // add here SyntaxHighlighted
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

    receiveMessage("project-message", (msg) => {
      setMessages((prev) => {
        console.log("Received message:", JSON.parse(msg.message));
        const message = JSON.parse(msg.message);
        webContainer?.mount(message.fileTree);
        if (message.fileTree) {
          setFiletree(message.fileTree);
        }
        const exists = prev.some(
          (m) => m.message === msg.message && m.sender?._id === msg.sender?._id
        );
        if (exists) return prev;
        if (msg.sender?._id === user._id) return prev;
        return [...prev, msg];
      });
    });

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users/all");
        setUsers(res.data.users);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchProject = async () => {
      try {
        const res = await axios.get(`/projects/get-project/${project._id}`);
        setProject(res.data.project);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProject();
    fetchUsers();
  }, [project._id]);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTo({
        top: messageBox.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <main className="h-screen w-screen flex overflow-hidden bg-slate-100">
      {/* Chat Section */}
      <section className="relative flex flex-col h-full w-full max-w-md bg-white shadow-md">
        {/* Header */}
        <header className="flex justify-between items-center p-3 bg-slate-200">
          <button
            className="flex items-center gap-2 text-sm font-medium"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-line"></i> Add Collaborators
          </button>
          <button
            className="p-2 hover:bg-slate-300 rounded-full"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        {/* Messages */}
        <div className="flex flex-col flex-grow overflow-hidden">
          <div
            ref={messageBox}
            className="flex-grow overflow-y-auto p-3 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent"
          >
            {messages.map((msg, idx) => {
              const isMine = msg.sender?._id === user._id;
              return (
                <div
                  key={idx}
                  className={`flex ${isMine ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`p-2 px-3 rounded-lg shadow-sm break-words`}
                    style={{
                      maxWidth: "90%",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      backgroundColor: isMine ? "#DBEAFE" : "#F1F5F9",
                    }}
                  >
                    <small className="block opacity-60 text-xs mb-1">
                      {msg.sender?.email || "Unknown"}
                    </small>
                    {/* Render markdown */}
                    <div
                      className={`overflow-auto rounded-sm ${
                        msg.sender?._id === "ai"
                          ? " bg-slate-800 text-white"
                          : ""
                      } `}
                    >
                      {/* <Markdown options={{ forceBlock: true }}>
                        {msg.message}
                      </Markdown> */}
                      <div className="text-sm">
                        {msg.sender._id === "ai" ? (
                          WriteAiMessage(msg.message)
                        ) : (
                          <p>{msg.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="border-t bg-white p-3 flex items-center gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Enter your message..."
              className="flex-grow p-2 border rounded-md outline-none focus:ring-1 focus:ring-slate-400"
            />
            <button
              onClick={send}
              className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
            >
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div
          className={`absolute top-0 h-full max-w-xs w-full bg-slate-50 transition-transform ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-between items-center p-4 bg-slate-200 border-b">
            <h1 className="text-lg font-semibold">Collaborators</h1>
            <button onClick={() => setIsSidePanelOpen(false)}>
              <i className="ri-close-line text-xl"></i>
            </button>
          </header>
          <div className="p-3 flex flex-col gap-2 overflow-y-auto">
            {project.users?.map((usr) => (
              <div
                key={usr._id}
                className="flex items-center gap-3 p-2 hover:bg-slate-200 rounded-md"
              >
                <div className="bg-slate-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
                  <i className="ri-user-fill"></i>
                </div>
                <p>{usr.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="right  bg-red-50 flex-grow h-full flex">
        <div className="explorer h-full max-w-64 min-w-52   bg-slate-200">
          <div className="file-tree w-full">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log("Clicked file:", file);

                  setOpenFiles([...new Set([...openFiles, file])]);

                  setCurrentFile(file);
                }}
                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full"
              >
                <p className=" font-semibold text-lg">{file}</p>
              </button>
            ))}
          </div>
        </div>

        {/* {currentFile && ( */}  
          <div className="code-editor flex flex-col flex-grow h-full shrink">
            <div className="top flex">
              <div className="files flex justify-between w-full">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFile(file)}
                  className={`px-4 py-2 border-b ${
                    currentFile === file ? "bg-white border-slate-400" : ""
                  }`}
                >
                  {file}
                </button>
              ))}
              </div>
              <div className="actions flex gap-2">
                <button
                onClick={async()=>{
                    await webContainer.mount(fileTree)
                 const installProcess = await webContainer.spawn("npm", [ "install" ])
                installProcess.output.pipeTo(new WritableStream({
                  write(data) {
                    console.log(data);
                  }
                }));
                if(runProcess){
                  runProcess.kill()
                }

                let tempRunprocess = await webContainer.spawn("npm", [ "start" ])

                tempRunprocess.output.pipeTo(new WritableStream({
                  write(data) {
                    console.log(data);
                  }
                }));
                setRunProcess(tempRunprocess)


                webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                    })
                }}
                >
                  Run
                </button>
                 </div>
            </div>
            <div className="bottom flex flex-grow">
             {fileTree[currentFile] && (
  <textarea
    className="w-full h-full bg-slate-900 text-white p-4 font-mono text-sm outline-none resize-none"
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
  ></textarea>
)}

            </div>
          </div>

          {iframeUrl && webContainer && 
          <div className="flex flex-col h-full min-w-96">

            <div className="address-bar">
              <input
                onChange={(e)=>setIframeUrl(e.target.value)}
                type="text"
                value={iframeUrl}
                className="w-full p-2 border-b"
              />
            </div>
            <iframe
              src={iframeUrl}
              className="w-full h-full"
            ></iframe>


             </div>
          }
        {/* )} */}


      </section>

      {/* Add Collaborator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-5 relative">
            <header className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Select Users</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </header>

            <div className="mt-4 mb-16 max-h-96 overflow-auto">
              {users.map((usr) => (
                <div
                  key={usr._id}
                  onClick={() => handleUserClick(usr._id)}
                  className={`cursor-pointer p-2 flex items-center gap-2 rounded-md ${
                    selectedUserId.has(usr._id)
                      ? "bg-slate-200"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <div className="bg-slate-600 text-white w-8 h-8 flex items-center justify-center rounded-full">
                    <i className="ri-user-fill"></i>
                  </div>
                  <h1 className="text-sm font-medium">{usr.email}</h1>
                </div>
              ))}
            </div>

            <button
              onClick={addCollaborators}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
