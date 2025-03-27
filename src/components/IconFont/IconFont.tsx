// 图标库项目来自 https://www.iconfont.cn/
// 图标库项目更新时，需要下载源代码并替换 /public/iconfont.js
import { CSSProperties } from 'react';
import styles from './IconFont.module.less';

export const IconFont = (props: {
  href: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <svg
      className={`${styles['icon-font']} ${props.className ? props.className : ''}`}
      aria-hidden="true"
      style={props.style}
    >
      <use xlinkHref={`#${props.href}`}></use>
    </svg>
  );
};
