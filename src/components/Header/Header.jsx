import {levelButtons} from '../../helpers/constants';
import styles from './Header.module.scss';

export default function Header({correct = 0, wrong = 0, children, gridRepeat, setGridSize}) {
  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <div className={styles.cell}>
          <div className={styles.info}>
            <span className={styles.infoLabel}>Correct:</span>
            <b className={styles.infoValue}>{correct}</b>
          </div>
          <div className={`${styles.info} ${styles.infoAlt}`}>
            <span className={styles.infoLabel}>Wrong:</span>
            <b className={styles.infoValue}>{wrong}</b>
          </div>
        </div>

        {children && children}

        <div className={styles.cell}>
          {levelButtons?.map(({label, cols, sliceSize}, index) => (
            <button
              key={index}
              className={styles.btn}
              type='button'
              disabled={gridRepeat === cols}
              onClick={() => setGridSize(sliceSize)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
