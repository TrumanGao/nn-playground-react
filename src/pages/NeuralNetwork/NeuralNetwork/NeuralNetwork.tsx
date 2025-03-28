import { useSize } from '@/hooks/useSize';
import { useMyMessage } from '@/hooks/useMyMessage';
import { useAppStore } from '@/states';
import styles from './NeuralNetwork.module.less';

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
