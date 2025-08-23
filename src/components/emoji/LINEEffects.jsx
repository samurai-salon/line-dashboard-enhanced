import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Star, Zap } from 'lucide-react';

const LINEEffects = ({ trigger, onComplete }) => {
  const [effects, setEffects] = useState([]);

  const effectTypes = {
    love: {
      emoji: '💕',
      color: '#ff69b4',
      duration: 2000,
      animation: 'float-up'
    },
    celebration: {
      emoji: '🎉',
      color: '#ffd700',
      duration: 2500,
      animation: 'explode'
    },
    sparkle: {
      emoji: '✨',
      color: '#87ceeb',
      duration: 1800,
      animation: 'twinkle'
    },
    fire: {
      emoji: '🔥',
      color: '#ff4500',
      duration: 2200,
      animation: 'burn'
    }
  };

  useEffect(() => {
    if (trigger) {
      createEffect(trigger);
    }
  }, [trigger]);

  const createEffect = (type) => {
    const effect = effectTypes[type];
    if (!effect) return;

    const newEffect = {
      id: Date.now() + Math.random(),
      ...effect,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    };

    setEffects(prev => [...prev, newEffect]);

    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== newEffect.id));
      if (onComplete) onComplete();
    }, effect.duration);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {effects.map(effect => (
        <div
          key={effect.id}
          className={`absolute text-4xl effect-${effect.animation}`}
          style={{
            left: effect.x,
            top: effect.y,
            color: effect.color,
            animationDuration: `${effect.duration}ms`
          }}
        >
          {effect.emoji}
        </div>
      ))}
      
      <style jsx>{`
        .effect-float-up {
          animation: floatUp ease-out forwards;
        }
        
        .effect-explode {
          animation: explode ease-out forwards;
        }
        
        .effect-twinkle {
          animation: twinkle ease-in-out forwards;
        }
        
        .effect-burn {
          animation: burn ease-out forwards;
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            transform: translateY(-20px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes explode {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.2) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes burn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.3) translateY(-100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LINEEffects;