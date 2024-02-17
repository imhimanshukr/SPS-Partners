import { registerPlugins } from '@/plugins'
import App from './App.vue'
import store from './store';
import { createApp } from 'vue';
import Toast from "vue-toastification";
import "./custom.css";
import "vue-toastification/dist/index.css";

const app = createApp(App)

registerPlugins(app)

app.use(Toast, {timeout: 2000});
app.use(store);
app.mount('#app')
