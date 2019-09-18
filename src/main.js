import Vue from 'vue'
import App from './App.vue'
import 'vant/lib/index.css';
import { Row, Col } from 'vant';
import { Field } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Button } from 'vant';
import axios from 'axios';
Vue.prototype.$axios = axios;
import { Toast } from 'vant';
import { DatetimePicker } from 'vant';
import { Popup } from 'vant';
import { Picker } from 'vant';
import { Tab, Tabs } from 'vant';

Vue.use(Tab).use(Tabs);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Toast);
Vue.use(Button);
Vue.use(Cell).use(CellGroup);
Vue.use(Field);
Vue.use(Row).use(Col);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
