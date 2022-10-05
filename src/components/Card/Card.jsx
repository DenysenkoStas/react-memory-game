import {ReactComponent as QuestionMarkIcon} from '../../assets/icons/question_mark.svg';
import styles from './Card.module.scss';

export default function Card({open, color, value, onClick}) {
  return (
    <button
      style={{backgroundColor: open ? color : ''}}
      className={styles.root}
      type='button'
      disabled={open}
      onClick={onClick}
    >
      {open ? value : <QuestionMarkIcon />}
    </button>
  );
}
