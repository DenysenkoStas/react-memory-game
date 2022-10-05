import styles from './Dialog.module.scss';

export default function Dialog({open, scores, time, gridRepeat, resetLevel, nextLevel}) {
  return (
    <div className={`${styles.root}${open ? ` ${styles.active}` : ''}`}>
      {open && (
        <div className={styles.dialog}>
          <h1 className={styles.title}>LEVEL COMPLETE</h1>

          <div className={styles.score}>
            <small>Your scores:</small>
            <span>{scores}</span>
          </div>

          <div className={styles.time}>
            <small>Level time: </small>
            <span>
              {time?.minutes}:{time?.seconds}:{time?.milliseconds}
            </span>
          </div>

          <div className={styles.btnGroup}>
            <button className={`${styles.btn} ${styles.btnAlt}`} type='button' onClick={resetLevel}>
              Replay
            </button>
            {gridRepeat !== 6 && (
              <button className={styles.btn} type='button' onClick={nextLevel}>
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
