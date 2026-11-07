import { useState, useRef, useCallback } from 'react';

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  mediaBlob: Blob | null;
  mediaUrl: string | null;
  audioBlob: Blob | null;
  audioUrl: string | null;
  videoStream: MediaStream | null;
  isVideo: boolean;
  error: string | null;
  startRecording: (withVideo?: boolean) => Promise<boolean>;
  stopRecording: () => Promise<Blob | null>;
  resetMedia: () => void;
  resetAudio: () => void;
  downloadMedia: (suggestedName?: string) => void;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isVideoRef = useRef(false);

  const startRecording = useCallback(async (withVideo = false): Promise<boolean> => {
    setError(null);
    chunksRef.current = [];
    isVideoRef.current = withVideo;
    setIsVideo(withVideo);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Media recording is not supported in this browser.');
      return false;
    }

    try {
      let stream: MediaStream;

      if (withVideo) {
        // Request video + audio (prefer selfie front-camera for Reels / Shorts)
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: {
            facingMode: 'user',
            width: { ideal: 720 },
            height: { ideal: 1280 }, // 9:16 portrait ideal for Instagram Reels
          },
        });
      } else {
        // Audio only
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      }

      streamRef.current = stream;
      setVideoStream(stream);

      // Determine best supported mimeType
      let mimeType = '';
      if (withVideo) {
        const videoTypes = [
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm',
          'video/mp4',
        ];
        mimeType = videoTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      } else {
        const audioTypes = [
          'audio/webm',
          'audio/mp4',
          'audio/ogg',
        ];
        mimeType = audioTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start(250); // capture in chunks
      setIsRecording(true);
      return true;
    } catch (err: any) {
      console.warn('Media capture error:', err);
      // If video failed (e.g. no webcam), fallback to audio-only
      if (withVideo) {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = fallbackStream;
          setVideoStream(null);
          isVideoRef.current = false;
          setIsVideo(false);

          const recorder = new MediaRecorder(fallbackStream);
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
          };
          recorder.start(250);
          setIsRecording(true);
          return true;
        } catch (_) {}
      }

      setError(err.message || 'Could not access microphone/camera.');
      return false;
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || (isVideoRef.current ? 'video/webm' : 'audio/webm');
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setMediaBlob(blob);
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        setIsRecording(false);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setVideoStream(null);

        resolve(blob);
      };

      try {
        recorder.stop();
      } catch (e) {
        setIsRecording(false);
        resolve(null);
      }
    });
  }, []);

  const resetMedia = useCallback(() => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }
    setMediaBlob(null);
    setMediaUrl(null);
    setVideoStream(null);
    chunksRef.current = [];
  }, [mediaUrl]);

  const downloadMedia = useCallback(
    (suggestedName?: string) => {
      if (!mediaBlob || !mediaUrl) return;
      const isVid = isVideoRef.current || mediaBlob.type.startsWith('video');
      const ext = mediaBlob.type.includes('mp4') ? 'mp4' : isVid ? 'webm' : 'webm';
      const filename = suggestedName || `QuoteTalk_Reel_${Date.now()}.${ext}`;

      const a = document.createElement('a');
      a.href = mediaUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    [mediaBlob, mediaUrl]
  );

  return {
    isRecording,
    mediaBlob,
    mediaUrl,
    audioBlob: mediaBlob,
    audioUrl: mediaUrl,
    videoStream,
    isVideo,
    error,
    startRecording,
    stopRecording,
    resetMedia,
    resetAudio: resetMedia,
    downloadMedia,
  };
}
