import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lesson } from '../../types/course';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Settings,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';

interface CustomVideoPlayerProps {
  lesson: Lesson;
  hasPrev: boolean;
  hasNext: boolean;
  onPrevLesson: () => void;
  onNextLesson: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVideoEnded?: () => void;
  onLoadedMetadata?: (duration: number) => void;
  initialTime?: number;
}

export default function CustomVideoPlayer({
  lesson,
  hasPrev,
  hasNext,
  onPrevLesson,
  onNextLesson,
  onTimeUpdate,
  onVideoEnded,
  onLoadedMetadata,
  initialTime = 0,
}: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Throttled Progress Saving Ref (Saves every 2 seconds during continuous playback)
  const lastSavedTimeRef = useRef<number>(0);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls during mouse inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
      }
    }, 3500);
  };

  // Reset state when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoError(false);
    setShowSpeedMenu(false);
    lastSavedTimeRef.current = 0;
  }, [lesson.id]);

  // Handle Video Metadata Loaded & Restore Playback Position
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const vidDur = videoRef.current.duration || lesson.durationSeconds || 0;
    setDuration(vidDur);
    setVideoError(false);

    // 6. Restore last watched position when user returns
    if (initialTime > 0 && initialTime < vidDur - 2) {
      videoRef.current.currentTime = initialTime;
      setCurrentTime(initialTime);
      lastSavedTimeRef.current = initialTime;
    }

    if (onLoadedMetadata) {
      onLoadedMetadata(vidDur);
    }
  };

  // Flush current playback position to parent & storage
  const flushProgress = useCallback((force?: boolean) => {
    if (!videoRef.current) return;
    const now = videoRef.current.currentTime;
    const vidDur = videoRef.current.duration || duration;

    // Requirement 3: Save progress regularly without performance issues (throttled every 2s or on force)
    if (force || Math.abs(now - lastSavedTimeRef.current) >= 2) {
      lastSavedTimeRef.current = now;
      if (onTimeUpdate && vidDur > 0) {
        onTimeUpdate(now, vidDur);
      }
    }
  }, [duration, onTimeUpdate]);

  // Handle Time Update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const now = videoRef.current.currentTime;
    setCurrentTime(now);

    if (videoRef.current.buffered.length > 0) {
      setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }

    // Save progress throttled
    flushProgress(false);
  };

  // Requirement 4: Save progress when user pauses
  const handlePause = () => {
    setIsPlaying(false);
    flushProgress(true);
  };

  // Handle Video Ended
  const handleEnded = () => {
    setIsPlaying(false);
    flushProgress(true);
    if (onVideoEnded) {
      onVideoEnded();
    }
  };

  // Requirement 5: Save progress when user leaves the page or tab
  useEffect(() => {
    const handleUnloadOrHide = () => {
      if (videoRef.current) {
        flushProgress(true);
      }
    };

    window.addEventListener('beforeunload', handleUnloadOrHide);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleUnloadOrHide();
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleUnloadOrHide);
    };
  }, [flushProgress]);

  // Play / Pause Toggle
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current || videoError) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      flushProgress(true);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setVideoError(true));
    }
  }, [isPlaying, videoError, flushProgress]);

  // Volume Change
  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    videoRef.current.volume = clamped;
    setIsMuted(clamped === 0);
    videoRef.current.muted = clamped === 0;
  };

  // Mute / Unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  // Playback Rate
  const handleRateChange = (rate: number) => {
    if (!videoRef.current) return;
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
    setShowSpeedMenu(false);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Seek / Scrub Action
  const seekToPosition = (clientX: number) => {
    if (!progressBarRef.current || !videoRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = pos * duration;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    flushProgress(true);
  };

  const handleProgressBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    seekToPosition(e.clientX);
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);

    if (isScrubbing) {
      seekToPosition(e.clientX);
    }
  };

  const handleProgressBarMouseLeave = () => {
    setHoverTime(null);
    setIsScrubbing(false);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
            flushProgress(true);
          }
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          if (videoRef.current && duration > 0) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
            flushProgress(true);
          }
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, volume, duration, flushProgress]);

  // Format Seconds
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl border border-[#434752] select-none"
    >
      {/* HTML5 Video Element */}
      <video
        key={lesson.id}
        ref={videoRef}
        src={lesson.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlayPause}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={() => setVideoError(true)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Central Play Overlay Button */}
      {!isPlaying && !videoError && (
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#aec6ff]/90 text-[#0f131b] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer z-10"
        >
          <Play className="w-8 h-8 fill-current ml-1" />
        </button>
      )}

      {/* Missing Local MP4 Notice */}
      {videoError && (
        <div className="absolute inset-0 bg-[#0f131b]/95 p-6 flex flex-col items-center justify-center text-center space-y-3 z-30">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-bold text-white">MP4 Video File Not Found</h3>
            <p className="text-xs text-[#9ea3b5]">
              The video file for this lesson is expected at:
            </p>
            <div className="bg-[#181c24] border border-[#434752] p-2 rounded-md font-mono text-[11px] text-[#aec6ff] break-all">
              public{lesson.videoUrl}
            </div>
          </div>

          <div className="bg-[#181c24]/90 p-3 rounded-lg border border-[#434752]/60 text-[11px] text-[#c3c6d4] text-left max-w-md space-y-1 font-mono">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
              <FolderOpen className="w-4 h-4" />
              <span>How to add your video file:</span>
            </div>
            <p>1. Place your `.mp4` video into:</p>
            <p className="text-[#aec6ff] font-bold">
              public{lesson.videoUrl.substring(0, lesson.videoUrl.lastIndexOf('/'))}/
            </p>
            <p>2. Name it: <span className="text-white font-bold">{lesson.videoUrl.split('/').pop()}</span></p>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 space-y-2 transition-opacity duration-300 z-20 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Seek Bar */}
        <div
          ref={progressBarRef}
          onMouseDown={handleProgressBarMouseDown}
          onMouseMove={handleProgressBarMouseMove}
          onMouseLeave={handleProgressBarMouseLeave}
          className="relative h-2 w-full bg-[#31353d]/80 hover:h-3 rounded-full overflow-hidden cursor-pointer transition-all group/bar"
        >
          {hoverTime !== null && (
            <div
              className="absolute -top-7 transform -translate-x-1/2 bg-[#aec6ff] text-[#0f131b] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow z-30 pointer-events-none"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          <div
            className="absolute h-full bg-[#525766] transition-all duration-200"
            style={{ width: `${Math.min(100, bufferPercent)}%` }}
          />

          <div
            className="absolute h-full bg-[#aec6ff] transition-all duration-75 relative flex items-center justify-end"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md transform translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-xs text-[#dfe2ed] pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              disabled={videoError}
              className="p-1.5 text-white hover:text-[#aec6ff] transition-colors cursor-pointer disabled:opacity-40"
              title={isPlaying ? 'Pause (Space / K)' : 'Play (Space / K)'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, currentTime - 5);
                  flushProgress(true);
                }
              }}
              className="p-1 text-[#c3c6d4] hover:text-white transition-colors cursor-pointer"
              title="Rewind 5s (Left Arrow / J)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (videoRef.current && duration > 0) {
                  videoRef.current.currentTime = Math.min(duration, currentTime + 5);
                  flushProgress(true);
                }
              }}
              className="p-1 text-[#c3c6d4] hover:text-white transition-colors cursor-pointer"
              title="Fast Forward 5s (Right Arrow / L)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={onPrevLesson}
              disabled={!hasPrev}
              className="p-1 text-[#c3c6d4] hover:text-[#aec6ff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-0.5"
              title="Previous Video"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onNextLesson}
              disabled={!hasNext}
              className="p-1 text-[#c3c6d4] hover:text-[#aec6ff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-0.5"
              title="Next Video"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 group/vol relative">
              <button
                onClick={toggleMute}
                className="p-1 text-[#c3c6d4] hover:text-white transition-colors cursor-pointer"
                title="Mute / Unmute (M)"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 accent-[#aec6ff] bg-[#31353d] rounded-lg appearance-none cursor-pointer"
                title="Volume"
              />
            </div>

            <div className="font-mono text-xs text-[#c3c6d4] ml-2">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span className="text-[#8d909d]"> / </span>
              <span className="text-[#8d909d]">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 bg-[#1e2430] hover:bg-[#2d3648] border border-[#434752] rounded text-[11px] font-mono font-bold text-[#aec6ff] cursor-pointer transition-colors flex items-center gap-1"
                title="Playback Speed"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{playbackRate}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-[#181c24] border border-[#434752] rounded-lg p-1.5 shadow-xl flex flex-col space-y-1 z-30 w-24">
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`text-left px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-[#aec6ff] text-[#0f131b] font-bold'
                          : 'hover:bg-[#232936] text-[#c3c6d4]'
                      }`}
                    >
                      {rate}x {rate === 1 ? '(Normal)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1 text-[#c3c6d4] hover:text-white transition-colors cursor-pointer"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
