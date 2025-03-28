import styles from './BoundaryPage.module.less';

export function Component() {
  return (
    <div className={styles['boundary-container']}>
      <div className={styles['boundary-header']}></div>
      <div className={styles['boundary-main']}>
        <div className={styles['boundary-content']}>{'BoundaryPage'}</div>
      </div>
    </div>
  );
}
Component.displayName = 'BoundaryPage';
