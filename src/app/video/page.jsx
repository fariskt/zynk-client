// // "use client";

// // import SimplePeer from "simple-peer";
// // import axios from "axios";
// // import useAuthStore from "@/src/store/useAuthStore";
// // import { getSocket } from "@/src/lib/socket";
// // import { useEffect, useRef, useState } from "react";
// // import AxiosInstance from "@/src/lib/axiosInstance";

// // const VideoCall = () => {
// //   const { user } = useAuthStore();
// //   const [users, setUsers] = useState([]);
// //   const [stream, setStream] = useState(null);
// //   const [callFrom, setCallFrom] = useState(null);
// //   const userVideo = useRef();
// //   const remoteVideo = useRef();
// //   const peerRef = useRef(null);
// //   const socket = getSocket();

// //   useEffect(() => {
// //     if (!user?._id) return;
// //     socket.connect()

// //     socket.emit("register", user?._id);

// //     AxiosInstance.get("/user/users").then((res) => {
// //       console.log("Users:", res.data);
// //       setUsers(res.data?.data);
// //     });

// //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
// //       setStream(stream);
// //       if (userVideo.current) userVideo.current.srcObject = stream;
// //     });

// //     socket.on("incoming-call", handleIncomingCall);
// //     socket.on("call-answered", handleCallAnswered);
// //     socket.on("ice-candidate", handleNewICECandidate);

// //     return () => {
// //       socket.off("incoming-call");
// //       socket.off("call-answered");
// //       socket.off("ice-candidate");
// //     };
// //   }, [user]); // Add `user` to dependency array to avoid issues

// //   const callUser = (userId) => {
// //     console.log("Calling:", userId);

// //     if (!stream) {
// //         console.error("No media stream available!");
// //         return;
// //     }

// //     const peer = new SimplePeer({ initiator: true, trickle: false, stream });

// //     peer.on("signal", (offer) => {
// //         console.log("Emitting call-user event with offer:", offer);
// //         socket.emit("call-user", { from: user?._id, to: userId, offer });
// //     });

// //     peer.on("stream", (remoteStream) => {
// //         console.log("Received remote stream", remoteStream);
// //         if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
// //     });

// //     peerRef.current = peer;
// // };

// // const handleIncomingCall = async ({ from, offer }) => {
// //   console.log("Incoming call from:", from);
// //   setCallFrom(from);

// //   try {
// //       let newStream = stream; // Use existing stream if available

// //       if (!newStream) {
// //           console.log("Requesting media permissions...");
// //           newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
// //           setStream(newStream);
// //       }

// //       if (userVideo.current) {
// //           userVideo.current.srcObject = newStream;
// //       }

// //       const peer = new SimplePeer({ initiator: false, trickle: false, stream: newStream });

// //       peer.on("signal", (answer) => {
// //           console.log("Sending answer back to:", from);
// //           socket.emit("answer-call", { from, answer });
// //       });

// //       peer.signal(offer);

// //       peer.on("stream", (remoteStream) => {
// //           console.log("Received remote stream", remoteStream);
// //           if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
// //       });

// //       peerRef.current = peer;
// //   } catch (error) {
// //       console.error("Failed to access media devices:", error);
// //   }
// // };



// //   const handleCallAnswered = ({ answer }) => {
// //     peerRef.current?.signal(answer);
// //   };

// //   const handleNewICECandidate = ({ candidate }) => {
// //     peerRef.current?.signal(candidate);
// //   };

// //   return (
// //     <div className="flex flex-col items-center gap-4">
// //       <h2>Video Call App</h2>
// //       <video ref={userVideo} autoPlay playsInline className="w-64 h-64 border border-blue-500" />
// //       <video ref={remoteVideo} autoPlay playsInline className="w-64 h-64 border border-red-500" />

// //       <h3>Users</h3>
// //       <ul>
// //         {users?.map((person) =>
// //           person._id !== user?._id ? (
// //             <li key={person._id} className="text-white">
// //               {person?.fullname}{" "}
// //               <button className="ml-2 p-2 bg-blue-500 text-white" onClick={() => callUser(person?._id)}>
// //                 Call
// //               </button>
// //             </li>
// //           ) : null
// //         )}
// //       </ul>

// //       {callFrom && (
// //         <button className="p-2 bg-green-500 text-white" onClick={() => handleIncomingCall(callFrom)}>
// //           Accept Call from {callFrom}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default VideoCall;


// "use client";

// import SimplePeer from "simple-peer";
// import { useEffect, useRef, useState } from "react";
// import useAuthStore from "@/src/store/useAuthStore";
// import { getSocket } from "@/src/lib/socket";
// import AxiosInstance from "@/src/lib/axiosInstance";

// const VideoCallModal = ({ calleeId, onClose }) => {
//   console.log(calleeId);
  
//   const { user } = useAuthStore();
//   const [users, setUsers] = useState([]);
//   const [stream, setStream] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [callAccepted, setCallAccepted] = useState(false);
//   const userVideo = useRef();
//   const remoteVideo = useRef();
//   const peerRef = useRef(null);
//   const socket = getSocket();

//   useEffect(() => {
//     if (!user?._id) return;
//     socket.connect();

//     socket.emit("register", user?._id);

//     AxiosInstance.get("/user/users").then((res) => {
//       setUsers(res.data?.data);
//     });

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
//       setStream(stream);
//       if (userVideo.current) userVideo.current.srcObject = stream;
//     });

//     socket.on("incoming-call", handleIncomingCall);
//     socket.on("call-answered", handleCallAnswered);
//     socket.on("ice-candidate", handleNewICECandidate);

//     return () => {
//       socket.off("incoming-call", handleIncomingCall);
//       socket.off("call-answered", handleCallAnswered);
//       socket.off("ice-candidate", handleNewICECandidate);
//     };
//   }, [user]);

//   const initiateCall = () => {
//     if (!stream) {
//       console.error("No media stream available!");
//       return;
//     }

//     socket.emit("call-request", { from: user?._id, to: calleeId });

//     socket.on("call-accepted", () => {
//       setCallAccepted(true);
//       startCall();
//     });
//   };

//   const startCall = () => {
//     const peer = new SimplePeer({ initiator: true, trickle: false, stream });

//     peer.on("signal", (offer) => {
//       socket.emit("call-user", { from: user?._id, to: calleeId, offer });
//     });

//     peer.on("stream", (remoteStream) => {
//       if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
//     });

//     peerRef.current = peer;
//   };

//   const handleIncomingCall = ({ from, offer }) => {
//     console.log("incoming....");
    
//     setIncomingCall({ from, offer });
//   };

//   const acceptCall = () => {
//     if (!incomingCall) return;

//     setCallAccepted(true);

//     const peer = new SimplePeer({ initiator: false, trickle: false, stream });

//     peer.on("signal", (answer) => {
//       console.log("anser", answer);
      
//       socket.emit("answer-call", { from: incomingCall.from, answer });
//     });

//     peer.signal(incomingCall.offer);

//     peer.on("stream", (remoteStream) => {
//       if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
//     });

//     peerRef.current = peer;
//   };

//   const handleCallAnswered = ({ answer }) => {
//     peerRef.current?.signal(answer);
//   };

//   const handleNewICECandidate = ({ candidate }) => {
//     peerRef.current?.signal(candidate);
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
//         <h2 className="text-lg font-bold">Video Call</h2>
//         <video ref={userVideo} autoPlay playsInline className="w-64 h-64 border border-blue-500" />
//         <video ref={remoteVideo} autoPlay playsInline className="w-64 h-64 border border-red-500" />

//         {!callAccepted && !incomingCall && (
//           <button onClick={initiateCall} className="mt-4 px-4 py-2 bg-blue-500 text-white">
//             Start Call
//           </button>
//         )}

//         {incomingCall && !callAccepted && (
//           <button onClick={acceptCall} className="mt-4 px-4 py-2 bg-green-500 text-white">
//             Accept Call
//           </button>
//         )}

//         <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VideoCallModal;
