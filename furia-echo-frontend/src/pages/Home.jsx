import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import intro from '../assets/intro.mp4';

export default function Home() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, []);

  const handleVideoEnd = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <video 
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay 
        muted 
        onEnded={handleVideoEnd}
      >
        <source src={intro} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <div className="flex-grow flex flex-col justify-center items-center relative z-10">
        <h1 className="text-6xl font-extrabold text-center font-serif">Furia Echo</h1>
      </div>
    </div>
  );
}
