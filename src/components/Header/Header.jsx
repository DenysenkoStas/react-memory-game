import {useState} from 'react';
import {levelButtons} from '../../helpers/constants';
import {useOutsideClick} from '../../helpers/hooks';
import {ReactComponent as GridIcon} from '../../assets/icons/grid.svg';
import {ReactComponent as RefreshIcon} from '../../assets/icons/refresh.svg';
import styles from './Header.module.scss';

export default function Header({correct = 0, wrong = 0, children, gridRepeat, resetLevel, setGridSize}) {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => setMenu((prev) => !prev);
  const closeMenu = () => setMenu(false);
  const clickRef = useOutsideClick(closeMenu);
  const selectLevel = (sliceSize) => () => {
    setGridSize(sliceSize);
    closeMenu();
  };

  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <div className={styles.cell}>
          <div className={styles.info}>
            <span className={styles.infoLabel}>Correct</span>
            <b className={styles.infoValue}>{correct}</b>
          </div>
          <div className={`${styles.info} ${styles.infoAlt}`}>
            <span className={styles.infoLabel}>Wrong</span>
            <b className={styles.infoValue}>{wrong}</b>
          </div>
        </div>

        {children && children}

        <div className={`${styles.cell} ${styles.gap}`}>
          <button className={styles.resetBtn} type='button' onClick={resetLevel}>
            <span>Reset</span>
            <RefreshIcon />
          </button>

          <div className={styles.menuWrap} ref={clickRef}>
            <button className={styles.menuBtn} type='button' onClick={toggleMenu}>
              <span>Levels</span>
              <GridIcon />
            </button>
            <div className={`${styles.menu}${menu ? ` ${styles.open}` : ''}`}>
              {levelButtons?.map(({label, cols, sliceSize}, index) => (
                <button
                  key={index}
                  className={styles.btn}
                  type='button'
                  disabled={gridRepeat === cols}
                  onClick={selectLevel(sliceSize)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
