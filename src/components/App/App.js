import {useCallback, useEffect, useState} from 'react';
import {icons} from '../../helpers/constants';
import {generateId, randomRgbColor, shuffleArray} from '../../helpers/functions';
import Header from '../Header';
import Stopwatch from '../Stopwatch';
import Dialog from '../Dialog';
import styles from './App.module.scss';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [gridRepeat, setGridRepeat] = useState(2);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [play, setPlay] = useState(false);
  const [reset, setReset] = useState(false);
  const [time, setTime] = useState({});
  const [scores, setScores] = useState(0);

  const generateArray = (array = [], sliceEnd = 8) => {
    const firstArray = array?.slice(0, sliceEnd).map((icon) => ({
      id: generateId(),
      value: icon,
      color: randomRgbColor()
    }));
    const secondArray = firstArray?.map((obj) => ({...obj, id: generateId()}));
    const concatArray = [...firstArray, ...secondArray];
    return shuffleArray(concatArray);
  };

  const setGridSize = (sliceEnd = 2) => {
    if (sliceEnd === 2) setGridRepeat(2);
    if (sliceEnd === 8) setGridRepeat(4);
    if (sliceEnd === 18) setGridRepeat(6);

    setLoading(true);
    const data = generateArray(icons, sliceEnd);
    if (data) {
      setCards(data);
      setTimeout(() => setLoading(false), 500);
    }
    resetState();
  };

  const resetState = () => {
    setFirst(null);
    setSecond(null);
    setCorrect(0);
    setWrong(0);
    if (cards.length / 2 !== correct) setScores(0);
  };

  const updateCard = (data, open = true) => {
    setCards((prev) =>
      prev.map((obj) => {
        if (obj.id === data.id) {
          return {...obj, open};
        }
        return obj;
      })
    );
  };

  const selectCard = (data) => () => {
    if (!first && !second) {
      setFirst(data);
      updateCard(data);
    }
    if (first && !second) {
      setSecond(data);
      updateCard(data);
    }
  };

  const compareCards = useCallback(() => {
    if (first && second) {
      if (first?.value === second?.value) {
        setCorrect((prev) => prev + 1);
        setTimeout(() => {
          updateCard(first);
          updateCard(second);
        }, 300);
      } else {
        setWrong((prev) => prev + 1);
        setTimeout(() => {
          updateCard(first, false);
          updateCard(second, false);
        }, 300);
      }

      setTimeout(() => {
        setFirst(null);
        setSecond(null);
      }, 300);
    }
  }, [first, second]);

  useEffect(() => {
    compareCards();
  }, [compareCards]);

  const resetLevel = () => {
    if (gridRepeat === 2) setGridSize(2);
    if (gridRepeat === 4) setGridSize(8);
    if (gridRepeat === 6) setGridSize(18);
    setReset(true);
    setScores(0);
  };

  const nextLevel = () => {
    if (gridRepeat === 2) setGridSize(8);
    if (gridRepeat === 4) setGridSize(18);
    if (gridRepeat === 6) setGridSize(2);
    setReset(true);
  };

  const calculateScores = (time) => {
    let bonus = 0;
    let multiplier = 2;
    // console.log(time);

    if (gridRepeat === 2) {
      if (Number(time?.minutes) && Number(time?.seconds) <= 30) multiplier = 3;
      if (!wrong) bonus = 100;
    }
    if (gridRepeat === 4) {
      if (Number(time?.minutes) <= 1) multiplier = 4;
      if (wrong <= 15) bonus = 500;
    }
    if (gridRepeat === 6) {
      if (Number(time?.minutes) <= 3) multiplier = 5;
      if (wrong <= 30) bonus = 1000;
    }

    const calc = correct * multiplier * 10 - wrong * 10 + bonus;
    setScores((prev) => prev + calc);
  };

  useEffect(() => {
    setGridSize();
  }, []);

  useEffect(() => {
    if (!play && first) {
      setPlay(true);
      setReset(false);
    }
  }, [first]);

  useEffect(() => {
    if (play) {
      setPlay(false);
      setReset(true);
    }
  }, [gridRepeat]);

  useEffect(() => {
    if (cards?.length && cards.length / 2 === correct) {
      setPlay(false);
      calculateScores(time);
    }
  }, [correct]);

  return (
    <>
      <Header {...{correct, wrong, gridRepeat, setGridSize}}>
        <Stopwatch play={play} reset={reset} saveTime={cards?.length / 2 === correct} returnTime={setTime} />
      </Header>

      <main className={styles.main}>
        <div style={{gridTemplateColumns: `repeat(${gridRepeat}, minmax(32px, 100px))`}} className={styles.grid}>
          {cards?.map(({id, value, color, open}) => (
            <button
              key={id}
              style={{backgroundColor: open || loading ? color : ''}}
              className={styles.card}
              type='button'
              disabled={open || loading}
              onClick={selectCard({id, value, open})}
            >
              <span className='material-symbols-rounded'>{open || loading ? value : 'question_mark'}</span>
            </button>
          ))}
        </div>
      </main>

      <Dialog {...{cards, correct, scores, time, gridRepeat, resetLevel, nextLevel}} />
    </>
  );
}
