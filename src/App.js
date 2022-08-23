import {useCallback, useEffect, useState} from 'react';
import styles from './App.module.scss';

export default function App() {
  const [firstLoad, setFirstLoad] = useState(true);
  const [cards, setCards] = useState([]);
  const [gridRepeat, setGridRepeat] = useState(4);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);

  const generateId = () => Math.floor(Math.random() * Date.now());
  const randomInteger = (max) => Math.floor(Math.random() * (max + 1));

  const randomRgbColor = () => {
    let r = randomInteger(255);
    let g = randomInteger(255);
    let b = randomInteger(255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const icons = [
    'favorite',
    'mood',
    'rocket_launch',
    'coronavirus',
    'skull',
    'cloudy',
    'support',
    'bug_report',
    'search',
    'home',
    'menu',
    'close',
    'settings',
    'done',
    'add',
    'star',
    'block',
    'css'
  ];

  const generateArray = (size = 8) => {
    return icons.slice(0, size).map((icon) => ({id: generateId(), value: icon, color: randomRgbColor()}));
  };

  const setGridSize = (size = 8) => {
    const firstArray = generateArray(size);
    const secondArray = firstArray?.map((obj) => ({...obj, id: generateId()}));
    const data = [...firstArray, ...secondArray];
    if (data) {
      if (size === 2) setGridRepeat(2);
      if (size === 8) setGridRepeat(4);
      if (size === 18) setGridRepeat(6);
      setCorrect(0);
      setWrong(0);
      shuffleArray(data);
      setCards(data);

      setFirstLoad(true);
      setTimeout(() => setFirstLoad(false), 500);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  useEffect(() => {
    setGridSize(8);
  }, []);

  const updateTiles = (data, open = true) => {
    setCards((prev) =>
      prev.map((obj) => {
        if (obj.id === data.id) {
          return {...obj, open};
        }
        return obj;
      })
    );
  };

  const selectTile = (data) => () => {
    if (!first && !second) {
      setFirst(data);
      updateTiles(data);
    }
    if (first && !second) {
      setSecond(data);
      updateTiles(data);
    }
  };

  const compareTiles = useCallback(() => {
    if (first && second) {
      if (first?.value === second?.value) {
        setCorrect((prev) => prev + 1);
        setTimeout(() => {
          updateTiles(first);
          updateTiles(second);
        }, 500);
      } else {
        setWrong((prev) => prev + 1);
        setTimeout(() => {
          updateTiles(first, false);
          updateTiles(second, false);
        }, 500);
      }

      setTimeout(() => {
        setFirst(null);
        setSecond(null);
      }, 500);
    }
  }, [first, second]);

  useEffect(() => {
    compareTiles();
  }, [compareTiles]);

  const resetCards = () => {
    if (gridRepeat === 2) setGridSize(2);
    if (gridRepeat === 4) setGridSize(8);
    if (gridRepeat === 6) setGridSize(18);
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <button className={styles.btn} type="button" disabled={gridRepeat === 2} onClick={() => setGridSize(2)}>
          2×2
        </button>
        <button className={styles.btn} type="button" disabled={gridRepeat === 4} onClick={() => setGridSize(8)}>
          4×4
        </button>
        <button className={styles.btn} type="button" disabled={gridRepeat === 6} onClick={() => setGridSize(18)}>
          6×6
        </button>
      </div>

      <div className={styles.header}>
        <span className={styles.score}>
          <b>Correct:</b>
          <span>{correct}</span>
        </span>
        <span className={styles.score}>
          <b>Wrong:</b>
          <span>{wrong}</span>
        </span>
      </div>

      <div style={{gridTemplateColumns: `repeat(${gridRepeat}, 100px)`}} className={styles.grid}>
        {cards?.map(({id, value, color, open}) => (
          <button
            key={id}
            style={{backgroundColor: open || firstLoad ? color : ''}}
            className={styles.card}
            type="button"
            disabled={open || firstLoad}
            onClick={selectTile({id, value, open})}
          >
            {open || firstLoad ? <span className="material-symbols-rounded">{value}</span> : '?'}
          </button>
        ))}
      </div>

      <div className={`${styles.dialog}${cards?.length / 2 === correct ? ` ${styles.active}` : ''}`}>
        {cards?.length / 2 === correct && (
          <>
            <h1 className={styles.dialogTitle}>COMPLETE</h1>
            <button className={styles.dialogBtn} type="button" onClick={resetCards}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
