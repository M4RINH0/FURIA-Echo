import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import intro from '../assets/intro.mp4';

export default function Home() {
  const videoRef = useRef(null); // Criando uma referência para o vídeo

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.35; // Definindo a velocidade de reprodução para 1.5x
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <video 
        ref={videoRef} // Atribuindo a referência ao vídeo
        className="absolute top-0 left-0 w-full h-full object-cover" 
        autoPlay 
        loop 
        muted
      >
        <source src={intro} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <div className="flex-grow flex flex-col justify-between relative z-10">
        <h1 className="text-6xl font-extrabold mb-6 text-center mt-6 font-serif">Furia Echo</h1>
        <div className="flex justify-center mb-6">
          <Link 
            to="/chat" 
            className="px-10 py-5 bg-[#1a1a2e] hover:bg-[#0f0f1a] rounded-full font-medium text-white"
          >
            Entrar no Chat
          </Link>
        </div>
      </div>
    </div>
  );
}