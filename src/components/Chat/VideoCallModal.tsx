"use client";

import SimplePeer, { Instance as SimplePeerInstance } from "simple-peer";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "@/src/store/useAuthStore";
import { getSocket } from "@/src/lib/socket";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa6";
import { MdCall, MdCallEnd, MdCallReceived } from "react-icons/md";
import toast from "react-hot-toast";

interface Caller {
  _id: string;
  fullname: string;
}

interface IncomingCall {
  from: string;
  offer: SimplePeer.SignalData;
}

interface VideoCallModalProps {
  caller: Caller | null;
  onClose: () => void;
  incomingCall: IncomingCall | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  caller,
  onClose,
  incomingCall,
  audioRef
}) => {
  const { user } = useAuthStore();

  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [callEndedByOtherUser, setCallEndedByOtherUser] = useState(false);

  const userVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<SimplePeerInstance | null>(null);
  const socket = getSocket();
  

  useEffect(() => {
    if (!user?._id) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) userVideo.current.srcObject = stream;
      })
      .catch((error) => console.error("Error accessing media devices:", error));

    socket.on("call-answered", handleCallAnswered);
    socket.on("call-ended", handleCallEnded);
    socket.on("ice-candidate", handleNewICECandidate);

    return () => {
      socket.off("call-answered", handleCallAnswered);
      socket.off("call-ended", handleCallEnded);
      socket.off("ice-candidate", handleNewICECandidate);
    };
  }, [user]);

  const initiateCall = () => {
    if (!stream || !caller?._id) {
      console.error("Stream or callee ID is missing!");
      return;
    }

    setCallStarted(true);

    const peer = new SimplePeer({ initiator: true, trickle: false, stream });

    peer.on("signal", (offer: unknown) => {
      socket.emit("call-user", { from: user?._id, to: caller._id, offer });
    });

    peer.on("stream", (remoteStream: MediaProvider | null) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
    });

    peerRef.current = peer;
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    setCallAccepted(true);
    setCallStarted(true);

    // Stop ringtone
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const peer = new SimplePeer({ initiator: false, trickle: false, stream });

    peer.on("signal", (answer: unknown) => {
      socket.emit("answer-call", { from: incomingCall.from, answer });
    });

    peer.signal(incomingCall.offer);

    peer.on("stream", (remoteStream: MediaProvider | null) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
    });

    peerRef.current = peer;
  };

  const handleCallAnswered = ({
    answer,
  }: {
    answer: SimplePeer.SignalData;
  }) => {
    peerRef.current?.signal(answer);
  };

  const handleNewICECandidate = ({
    candidate,
  }: {
    candidate: SimplePeer.SignalData;
  }) => {
    peerRef.current?.signal(candidate);
  };
  const cleanupMedia = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }

    setStream(undefined);
  };

  const endCall = () => {
    socket.emit("end-call", { from: user?._id, to: caller?._id });
    cleanupMedia();
    onClose();
  };

  const handleCallEnded = () => {
    setCallAccepted(false);
    setCallStarted(false);
    cleanupMedia();
    setCallEndedByOtherUser(true);
  };

  const toggleMic = () => {
    const audioTrack = stream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoHidden(!videoTrack.enabled);
    }
  };

  useEffect(() => {
    socket.on("call-ended", () => {
      onClose();
      cleanupMedia();
      setCallEndedByOtherUser(true);
      toast.success("Call ended", { position: "top-center" });
    });

    return () => {
      socket.off("call-ended");
    };
  }, []);
  

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center w-[800px] h-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        {incomingCall && !callAccepted && (
          <div className="relative left-1/2 w-full transform -translate-x-1/2  bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md">
            <MdCallReceived size={20} className="text-green-500" />
            <span className="w-full">
              Incoming call from <b>{caller?.fullname || "Unknown"}</b>
            </span>
          </div>
        )}

        <h2 className="text-xl font-semibold text-white mb-3">Video Call</h2>


        <div className="relative w-full h-full">
          {!callEndedByOtherUser && (
            <video
              ref={remoteVideo}
              autoPlay
              playsInline
              className="w-full h-full rounded-lg object-cover border-2 border-red-500"
            />
          )}
          <div className="absolute bottom-4 right-4 w-28 h-28 rounded-lg border-2 border-blue-500 shadow-lg overflow-hidden">
            <video
              ref={userVideo}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${
                videoHidden ? "opacity-80" : ""
              }`}
            />
          </div>
        </div>

        <div className="mt-2 justify-center items-center flex space-x-4 bg-gray-800 p-3 rounded-full shadow-lg">
          {!callStarted && !incomingCall && (
            <div
              onClick={initiateCall}
              className="flex items-center gap-2 bg-green-600 text-white p-3 cursor-pointer rounded-full hover:bg-green-500"
            >
              <span>Make Call</span>
              <button className="md:block hidden">
                <MdCall size={24} />
              </button>
            </div>
          )}

          {incomingCall && !callAccepted && (
            <button
              onClick={acceptCall}
              className="bg-green-600 text-white p-3 rounded-full hover:bg-green-500"
            >
              <MdCall size={24} />
            </button>
          )}

          <>
            <button
              onClick={toggleMic}
              className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600"
            >
              {micMuted ? (
                <FaMicrophoneSlash size={22} />
              ) : (
                <FaMicrophone size={22} />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600"
            >
              {videoHidden ? <FaVideoSlash size={22} /> : <FaVideo size={22} />}
            </button>

            {!callEndedByOtherUser && (
              <button
                onClick={endCall}
                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-500"
              >
                <MdCallEnd size={24} />
              </button>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
