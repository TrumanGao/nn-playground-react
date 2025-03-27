import { useSize } from '@/hooks/useSize';
import { useMyMessage } from '@/hooks/useMyMessage';
import { useAppStore } from '@/states';
import styles from './NeuralNetwork.module.less';
// bundle.css
import 'material-design-lite/material.min.css';
import './assets/styles.css';
// lib.js
import 'material-design-lite/material.min.js';
import 'seedrandom/seedrandom.min.js';
// analytics.js
import './assets/analytics';

export function Component() {
  const { windowSize } = useAppStore();
  useSize();
  const { myMessage, myMessageContextHolder } = useMyMessage({
    top: windowSize.innerHeight * 0.3,
  });

  return (
    <div className={styles['nn-container']}>
      {myMessageContextHolder()}
      <div className={styles['nn-main']}></div>
    </div>
  );
}
Component.displayName = 'NeuralNetwork';
