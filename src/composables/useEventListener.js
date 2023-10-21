import { onMounted, onUnmounted } from 'vue';

/**
 * 註冊與移除事件
 * @param {Object} target 事件目標
 * @param {string} event  事件類型
 * @param {function} callback 事件處理
 */
const useEventListener = (target, event, callback) => {
  onMounted(() => {
    target.addEventListener(event, callback);
  });

  onUnmounted(() => {
    target.removeEventListener(event, callback);
  });
};

export default useEventListener;
