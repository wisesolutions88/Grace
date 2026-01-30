
import { useState, useRef, useCallback } from 'react';
import { generateStudyAudio } from '../geminiService';
import { decodeBase64, decodeAudioData } from '../audioUtils';

export const useNarrator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const stop = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Source might have already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (isPlaying) {
      stop();
      return;
    }

    setIsLoading(true);
    try {
      const base64Audio = await generateStudyAudio(text);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        
        stop();
        source.start();
        sourceNodeRef.current = source;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Narration failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, stop]);

  return { speak, stop, isLoading, isPlaying };
};
