import { createVNode, render } from 'vue';
import modalComponent from '@/components/Modal.vue';

const pluginModal = {
  install(app) {
    // 1. 創建容器
    const modalContainer = document.createElement('div');

    // 2. 將 Modal.vue 轉換成虛擬 dom
    const modalVNode = createVNode(modalComponent);

    // 3. 透過 render 將其渲染到 modalContainer
    render(modalVNode, modalContainer);

    // 4. 將 modalContainer 新增至 document.body
    document.body.appendChild(modalContainer);

    // 5. 創建實例
    const modalInstance = modalVNode.component;

    // 6. 取得 Modal.vue 內的 methods，應該不是正規的寫法，但目前我只會這樣
    const modalCtx = modalInstance.ctx;

    // 7. 定義 Global 可用的 methods
    const modalMethods = {
      open({ title, msg, btnText }) {
        modalCtx.open({ title, msg, btnText });
      },
      hide() {
        modalCtx.hide();
      },
    };

    // 8. 註冊到 Global
    /* eslint-disable no-param-reassign */
    app.config.globalProperties.$modal = modalMethods;
    /* eslint-disable no-param-reassign */
  },
};

export default pluginModal;
