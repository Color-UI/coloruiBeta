import Vue from 'vue'
import store from '@/ui/store'
import modal from '@/ui/js/modal.js'
import util from '@/ui/js/util.js'
import mixin from '@/ui/js/mixin.js'
import app from "@/app/index.js"

// #ifdef H5
if (uni.getStorageSync("VUE_APP_NAME") != process.env.VUE_APP_NAME) {
	uni.clearStorage();
	uni.setStorageSync('VUE_APP_NAME', process.env.VUE_APP_NAME);
}
/*分析主题*/
var theme = uni.getStorageSync("sys_theme");
var main = uni.getStorageSync("sys_main");

if (!theme) {
	theme = store.getters.getCustomTheme;
}
if (!main) {
	main = store.getters.getCustomMain;
}
uni.setStorageSync('sys_theme', theme);
uni.setStorageSync('sys_main', main);
document.getElementsByTagName('html')[0].className += `theme-${theme} main-${main}`;

// #endif
uni.getStorage({
	key: 'userInfo',
	success: function(res) {
		store.commit('upUserInfo', res.data);
	}
});
uni.getStorage({
	key: 'app',
	success: function(res) {
		store.commit('initApp', res.data);
	}
});