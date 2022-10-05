import {useCallback, useEffect, useState} from 'react';
import {icons, levels} from '../../helpers/constants';
import {generateArray} from '../../helpers/functions';
import Header from '../Header';
import Stopwatch from '../Stopwatch';
import Card from '../Card';
import Dialog from '../Dialog';
import styles from './App.module.scss';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [gridRepeat, setGridRepeat] = useState(2);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [playTimer, setPlayTimer] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [time, setTime] = useState({});
  const [scores, setScores] = useState(0);

  const changeLevel = (sliceEnd = 2) => {
    setLoading(true);
    levels.find((level) => {
      if (level.sliceSize === sliceEnd) setGridRepeat(level.cols);
    });
    const data = generateArray(icons, sliceEnd);
    const displayTime = sliceEnd > 15 ? 1500 : 750;

    if (data?.length) {
      setCards(data);
      setLoading(false);
      showCards(displayTime);
    }
    resetStats();
  };

  useEffect(() => {
    changeLevel();
  }, []);

  const resetStats = () => {
    if (firstCard) setFirstCard(null);
    if (secondCard) setSecondCard(null);
    if (correct) setCorrect(0);
    if (wrong) setWrong(0);
    if (cards.length / 2 !== correct) setScores(0);
  };

  const showCards = (timeout) => {
    setShowAll(true);
    if (timeout) setTimeout(() => setShowAll(false), timeout);
  };

  const pauseLevel = () => playTimer && setPlayTimer(false);

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
    if (!firstCard && !secondCard) {
      setFirstCard(data);
      updateCard(data);
    }
    if (firstCard && !secondCard) {
      setSecondCard(data);
      updateCard(data);
    }
    startTimer();
  };

  const compareCards = useCallback(() => {
    if (firstCard && secondCard) {
      if (firstCard?.value === secondCard?.value) {
        setCorrect((prev) => prev + 1);
        setTimeout(() => {
          updateCard(firstCard);
          updateCard(secondCard);
        }, 300);
      } else {
        setWrong((prev) => prev + 1);
        setTimeout(() => {
          updateCard(firstCard, false);
          updateCard(secondCard, false);
        }, 300);
      }

      setTimeout(() => {
        setFirstCard(null);
        setSecondCard(null);
      }, 300);
    }
  }, [firstCard, secondCard]);

  useEffect(() => {
    compareCards();
  }, [compareCards]);

  const startTimer = () => {
    if (!playTimer) {
      setPlayTimer(true);
      if (resetTimer) setResetTimer(false);
    }
  };

  const stopTimer = () => {
    if (playTimer) {
      setPlayTimer(false);
      if (!resetTimer) setResetTimer(true);
    }
  };

  useEffect(() => {
    stopTimer();
  }, [gridRepeat]);

  const allCardsOpen = cards.length && cards.filter((card) => card?.open).length === cards.length;

  useEffect(() => {
    if (allCardsOpen) {
      stopTimer();
      calculateScores();
    }
  }, [time]);

  const calculateScores = () => {
    let bonus = 0;
    let multiplier = 2;
    const currentLevel = levels.find((level) => level.cols === gridRepeat);
    const finishTime = Number(time?.minutes) * 60 + Number(time?.seconds);

    if (gridRepeat === currentLevel.cols) {
      if (finishTime <= currentLevel.bonusTime) multiplier = currentLevel.cols + 1;
      if (!wrong || wrong <= currentLevel.sliceSize - currentLevel.cols) bonus = currentLevel.cols * 100;
    }

    const calc = correct * multiplier * 10 - wrong * 10 + bonus;
    setScores((prev) => prev + calc);
  };

  const resetLevel = () => {
    levels.find((level) => {
      if (level.cols === gridRepeat) changeLevel(level.sliceSize);
    });
    stopTimer();
    setScores(0);
    showCards();
  };

  const nextLevel = () => {
    let currentLevel = levels.findIndex((el) => el.cols === gridRepeat);
    changeLevel(levels[currentLevel + 1 === levels.length ? 0 : currentLevel + 1].sliceSize);
  };

  if (loading) return null;
  return (
    <>
      <Header {...{correct, wrong, gridRepeat, playTimer, pauseLevel, resetLevel, changeLevel}}>
        <Stopwatch play={playTimer} reset={resetTimer} saveTime={allCardsOpen} returnTime={setTime} />
      </Header>

      <main className={styles.main}>
        <div style={{gridTemplateColumns: `repeat(${gridRepeat}, minmax(32px, 100px))`}} className={styles.grid}>
          {cards?.map(({id, value, color, open}) => (
            <Card key={id} open={open || showAll} color={color} value={value} onClick={selectCard({id, value, open})} />
          ))}
        </div>
      </main>

      <Dialog open={allCardsOpen} {...{scores, time, gridRepeat, resetLevel, nextLevel}} />
    </>
  );
}
