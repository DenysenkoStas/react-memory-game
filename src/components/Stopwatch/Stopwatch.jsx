import {useEffect, useState} from 'react';
import styles from './Stopwatch.module.scss';

export default function Stopwatch({play, reset, saveTime, returnTime}) {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [data, setData] = useState({});

  const resetStopwatch = () => {
    setTime(0);
    setData({minutes: '00', seconds: '00', milliseconds: '00'});
  };

  useEffect(() => {
    if (play) {
      setStart(true);
    } else {
      setStart(false);
    }
  }, [play]);

  useEffect(() => {
    if (saveTime && typeof returnTime === 'function') {
      returnTime(data);
    }
  }, [saveTime]);

  useEffect(() => {
    reset && resetStopwatch();
  }, [reset]);

  useEffect(() => {
    setData({
      minutes: ('0' + Math.floor((time / 60000) % 60)).slice(-2),
      seconds: ('0' + Math.floor((time / 1000) % 60)).slice(-2),
      milliseconds: ('0' + ((time / 10) % 100)).slice(-2)
    });
  }, [time]);

  useEffect(() => {
    let interval = null;

    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [start]);

  return (
    <div className={styles.root}>
      {data?.minutes}
      <span>:</span>
      {data?.seconds}
      <span>:</span>
      {data?.milliseconds}
    </div>
  );
}
