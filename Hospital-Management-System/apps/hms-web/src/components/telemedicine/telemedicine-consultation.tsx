import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import {

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  Camera,
  MessageSquare,
  FileText,
  Clock
} from 'lucide-react';

interface TelemedicineSession {
  id: string,
  patientId: string;
  doctorId: string,
  type: 'VIDEO_CALL' | 'AUDIO_CALL' | 'CHAT';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  scheduledTime: string;
  patient: {
    id: string,
    full_name: string;
    mrn: string
  };
  doctor: {
    id: string,
    full_name: string;
    specialization: string
  };
}

const TelemedicineConsultation: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [session, setSession] = useState<TelemedicineSession | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetchSession();
    initializeWebRTC();

    // Session timer
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      cleanupWebRTC()
    };
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/telemedicine/sessions/${sessionId}`);
      const data = await response.json();
      setSession(data.session);
    } catch (error) {
      /* SECURITY: Console statement removed */
    }
  };

  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Send candidate to remote peer via signaling server
          /* SECURITY: Console statement removed */
        }
      };

    } catch (error) {
      /* SECURITY: Console statement removed */
    }
  };

  const cleanupWebRTC = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack != null) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack != null) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track with screen share
      if (peerConnectionRef?.current && localStreamRef.current) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find(s =>
          s?.track && s.track.kind === 'video'
        );

        if (sender != null) {
          await sender.replaceTrack(videoTrack);
          setIsScreenSharing(true);
        }
      }

      // Handle screen share end
      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        // Switch back to camera
        if (localStreamRef.current) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          const sender = peerConnectionRef.current?.getSenders().find(s =>
            s?.track && s.track.kind === 'video'
          );
          if (sender && cameraTrack) {
            sender.replaceTrack(cameraTrack);
          }
        }
      };
    } catch (error) {
      /* SECURITY: Console statement removed */
    }
  };

  const endSession = async () => {
    try {
      await fetch(`/api/telemedicine/sessions/${sessionId}/end`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationNotes,
          duration: sessionDuration
        })
      });

      cleanupWebRTC();
      // Navigate away or show end session UI
    } catch (error) {
      /* SECURITY: Console statement removed */
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: crypto.getRandomValues(new Uint32Array(1))[0].toString(),
        text: newMessage;
        sender: 'doctor', // or 'patient' based on user role
        timestamp: new Date().toISOString()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  };

  if (!session) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Telemedicine Consultation</h1>
          <p className="text-sm text-gray-600">
            {session.patient.full_name} - {session.patient.mrn}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(sessionDuration)}</span>
          </Badge>
          <Badge
            className={session.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
          >
            {session.status}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-800"
          />

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <Button
              size="lg"
              variant={isVideoEnabled ? "default" : "destructive"}
              onClick={toggleVideo}
              className="rounded-full h-12 w-12"
            >
              {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant={isAudioEnabled ? "default" : "destructive"}
              onClick={toggleAudio}
              className="rounded-full h-12 w-12"
            >
              {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant={isScreenSharing ? "secondary" : "outline"}
              onClick={startScreenShare}
              className="rounded-full h-12 w-12"
            >
              <Monitor className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="destructive"
              onClick={endSession}
              className="rounded-full h-12 w-12"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-white border-l flex flex-col">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button className="flex-1 p-3 text-sm font-medium border-r bg-blue-50 text-blue-600">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Chat
              </button>
              <button className="flex-1 p-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                <FileText className="h-4 w-4 inline mr-2" />
                Notes
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'doctor'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <Button size="sm" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default TelemedicineConsultation;
