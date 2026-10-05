import { useEffect, useRef } from 'react';

let apiPromise;
const loadYT = () => (apiPromise ||= new Promise((res) => {
  if (window.YT?.Player) return res(window.YT);
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  window.onYouTubeIframeAPIReady = () => res(window.YT);
}));


export default function VideoPlayer({ playback, onTick }) {
  const host = useRef(null);
  const player = useRef(null);
  const ready = useRef(false);
  const latest = useRef(playback);
  latest.current = playback;

  const apply = () => {
    const p = player.current, s = latest.current;
    if (!ready.current || !s.videoId) return;
    // Estimate where the video should be *now* (state may be a few ms old)
    const target = s.playState === 'playing' ? s.currentTime + (Date.now() - s.receivedAt) / 1000 : s.currentTime;
    const loaded = p.getVideoData?.().video_id;
    if (loaded !== s.videoId) p.loadVideoById(s.videoId, target);
    else if (Math.abs(p.getCurrentTime() - target) > 1.2) p.seekTo(target, true);
    if (s.playState === 'playing') p.playVideo(); else p.pauseVideo();
  };

  useEffect(() => {
    let timer, dead = false;
    loadYT().then((YT) => {
      if (dead) return;
      const mount = document.createElement('div');
      host.current.appendChild(mount);
      player.current = new YT.Player(mount, {
        width: '100%', height: '100%', videoId: latest.current.videoId,
        playerVars: { controls: 0, disablekb: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: { onReady: () => { ready.current = true; apply(); } },
      });
      timer = setInterval(() => {
        if (ready.current) onTick?.(player.current.getCurrentTime?.() || 0, player.current.getDuration?.() || 0);
      }, 500);
    });
    return () => { dead = true; clearInterval(timer); ready.current = false; player.current?.destroy?.(); };
  }, []);

 useEffect(() => {
  apply();
}, [playback]);

  return <div className="player" ref={host} />;
}
