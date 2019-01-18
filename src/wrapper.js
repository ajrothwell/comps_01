// Import vue component
// import component from './my-component.vue';
import component from './Badge.vue';
console.log('component:', component)

// Declare install function executed by Vue.use()
export function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('MyComponent', component);
}

console.log('install:', install);

// Create module definition for Vue.use()
const plugin = {
	install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	console.log('yes GlobalVue, plugin:', plugin);
	GlobalVue.use(plugin);
} else {
	console.log('no GlobalVue');
}

// To allow use as module (npm/webpack/etc.) export component
export default component;
