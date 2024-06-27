"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const objects = [
  { id: 1, src: '/bird1.png' },
  { id: 2, src: '/car.png' },
  { id: 3, src: '/love.png' },
];

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const resizeImage = (file, maxSize, callback) => {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = maxSize;
      canvas.height = maxSize;

      // Draw rounded rectangle
      const radius = 20; // Adjust this value for more or less rounded corners
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, 0, 0, maxSize, maxSize);
      canvas.toBlob(callback, file.type);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

export default function Home() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showBack, setShowBack] = useState(true);
  const [message, setMessage] = useState('');
  const [isPersonalize, setIsPersonalize] = useState(false);
  const [numPairs, setNumPairs] = useState(3);
  const [customImages, setCustomImages] = useState([]);

  useEffect(() => {
    initializeGame();
  }, [customImages]);

  const initializeGame = () => {
    const gameObjects = customImages.length ? customImages : objects;
    const duplicatedObjects = [...gameObjects.slice(0, numPairs), ...gameObjects.slice(0, numPairs)].map((object, index) => ({
      ...object,
      id: index + 1,
    }));
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
        setFlipped([]);
      }, 1000);

      if (matched.length + 2 === cards.length) {
        setTimeout(() => {
          setMessage('¡Victory!');
        }, 1000);
      }
    }
  };

  const handlePersonalize = () => {
    setIsPersonalize(true);
  };

  const handleNormal = () => {
    setIsPersonalize(false);
    setCustomImages([]);
    initializeGame();
  };

  const handleNumPairsChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 3 && value <= 10) {
      setNumPairs(value);
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 100, (blob) => {
        const updatedImages = [...customImages];
        updatedImages[index] = {
          id: index + 1,
          src: URL.createObjectURL(blob),
        };
        setCustomImages(updatedImages);
      });
    }
  };

  const handleOk = () => {
    if (customImages.length !== numPairs || customImages.includes(undefined)) {
      alert(`Please select ${numPairs} images.`);
      return;
    }
    if (numPairs < 3 || numPairs > 10) {
      alert("Number of pairs must be between 3 and 10.");
      return;
    }
    setIsPersonalize(false);
    initializeGame();
  };

  return (
    <div>
      <h1>Flip Card Game</h1>
      
      {!isPersonalize ? (
        <>
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
            <button onClick={handlePersonalize}>Personalize</button>
            <button onClick={handleNormal}>Normal</button>
          </div>
          
        </>
      ) : (
        <div className="personalize">
          <label>
            Number of pairs:
            <input type="number" min="3" max="10" value={numPairs} onChange={handleNumPairsChange} />
          </label>
          {Array.from({ length: numPairs }).map((_, index) => (
            <input
              key={index}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index)}
            />
          ))}
          <button onClick={handleOk}>OK</button>
          <button onClick={handleNormal}>Cancel</button>
        </div>
      )}
      
      <div className="project-github">
        <p>This project is in</p>
        <Link href="https://github.com/diegoperea20/Nextjs-Flip-Card-Game">
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
        .personalize {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .personalize label {
          font-size: 16px;
        }
        .personalize input[type="number"] {
          width: 50px;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
