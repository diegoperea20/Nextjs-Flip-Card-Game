"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
const objects = [
  { id: 1, src: '/bird1.png' },
  { id: 2, src: '/car.png' },
  { id: 3, src: '/love.png' },
];

const duplicatedObjects = [...objects, ...objects].map((object, index) => ({
  ...object,
  id: index + 1,
}));

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showBack, setShowBack] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    setCards(shuffleArray([...duplicatedObjects]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setShowBack(true);
    setMessage('');

    const timer = setTimeout(() => {
      setShowBack(false);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const cardMatched = cards[first].src === cards[second].src;

      if (cardMatched) {
        setMatched([...matched, first, second]);
      }

      setTimeout(() => {
        if (!cardMatched) {
          setFlipped([]);
        } else {
          setFlipped([]);
        }
      }, 1000);

      if (matched.length + 2 === cards.length) {
        setTimeout(() => {
          setMessage('¡Victory!');
        }, 1000);
      }
    }
  };

  return (
    <div>
      <h1>Flip Card Game</h1>
      
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleFlip(index)}
          >
            <div className={`inner ${flipped.includes(index) || matched.includes(index) ? 'flip' : ''}`}>
              <div className="back">
                <img src={card.src} alt="Object" />
              </div>
              <div className="front" />
            </div>
          </div>
        ))}
         
      </div>
      <div className="div-message">
      {message && <p className="message">{message}</p>}
      <p>Moves: {moves}</p>
      <button onClick={initializeGame}>Play Again</button>

      </div>
      <div className="project-github">
      <p>This project is in </p>
      <Link href="https://github.com/diegoperea20">
        <img width="96" height="96" src="https://img.icons8.com/fluency/96/github.png" alt="github"/>
      </Link>
    </div>
      
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 100px);
          grid-gap: 37px;
          justify-content: center;
        }
        .card {
          width: 100px;
          height: 100px;
          perspective: 1000px;
        }
        .inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s;
          transform: rotateY(${showBack ? '180deg' : '0deg'});
        }
        .inner.flip {
          transform: rotateY(180deg);
        }
        .front,
        .back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .front {
          transform: rotateY(0deg);
          background: url('/card.png') no-repeat center center;
          background-size: cover;
        }
        .back {
          transform: rotateY(180deg);
        }
       
      `}</style>
    </div>
  );
}
