<template>
	<view class="ui-fixed">
		<view
			class="ui-fixed-box"
			:id="'fixed-' + _uid"
			:class="[{ fixed: fixed }]"
			:style="[
				{
					left: sticky ? 'auto' : '0px',
					top: fixed && !bottom ? (noNav ? val : val + sys_navBar) + 'px' : 'auto',
					bottom: fixed && bottom ? val + 'px' : 'auto',
					zIndex: index + sys_layer
				}
			]"
		>
			<view class="ui-fixed-content" @tap="toTop" :style="[{ zIndex: index + sys_layer }]"><slot /></view>
			<view style="height: calc(env(safe-area-inset-bottom) / 5 * 3);" :class="[bg]" v-if="bottom && !noSafe"></view>
			<view
				class="ui-fixed-bg"
				:class="[bg, { shadow: shadow }, { 'shadow-sm': shadow == 'sm' }, { 'shadow-lg': shadow == 'lg' }]"
				:style="[{ zIndex: index + sys_layer - 1 }, bg == 'bg-img' ? { backgroundImage: 'url(' + img + ')' } : {}, opacity ? { opacity: opacityVal } : '']"
			></view>
		</view>
		<view
			class="skeleton"
			:id="'skeleton-' + _uid"
			:style="[{ height: height != 0 ? height + 'px' : content.height + 'px', width: width + 'px' }]"
			v-if="sticky ? fixed : placeholder && fixed"
		></view>
	</view>
</template>

<script>
export default {
	name: 'uiFixed',
	data() {
		return {
			content: {},
			fixed: true
		};
	},
	props: {
		noNav: {
			type: Boolean,
			default: false
		},
		noSafe: {
			type: Boolean,
			default: false
		},
		bottom: {
			type: Boolean,
			default: false
		},
		bg: {
			type: String,
			default: 'bg-none'
		},
		val: {
			type: Number,
			default: 0
		},
		height: {
			type: [String, Number],
			default: 0
		},
		width: {
			type: [String, Number],
			default: 0
		},
		opacity: {
			type: Boolean,
			default: false
		},
		opacityVal: {
			type: Number,
			default: 0
		},
		index: {
			type: [Number, String],
			default: 0
		},
		placeholder: {
			type: [Boolean],
			default: false
		},
		sticky: {
			type: [Boolean],
			default: false
		},
		shadow: {
			type: [Boolean, String],
			default: false
		},
		noFixed: {
			type: Boolean,
			default: false
		},
		clickTo: {
			type: Boolean,
			default: false
		}
	},
	created() {
		if (this.sticky) {
			this.fixed = false;
		}
		uni.$on('_scrollTop_' + this.$root._uid, e => {
			this.sys_scrollTop = e;
		});
	},
	watch: {
		sys_scrollTop(newValue, oldValue) {
			if (this.sticky) {
				this.setFixed(newValue);
			}
		},
		noFixed: {
			handler(val) {
				if (val) {
					this.fixed = false;
				}
			},
			immediate: true
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.computedQuery();
		});
	},
	destroyed() {
		uni.$off('_scrollTop_' + this.$root._uid);
	},
	methods: {
		computedQuery() {
			uni.createSelectorQuery()
				.in(this)
				.select('#fixed-' + this._uid)
				.boundingClientRect(data => {
					if (data != null) {
						if (this.height == 0) {
							// #ifdef H5
							// 解决H5刷新错位的问题
							let ele = document.getElementById('fixed-' + this._uid);
							data.top = ele?ele.offsetTop:0;
							
							// #endif
							this.content = data;
							this.$emit('getHeight', data.height);
							this.$emit('update:height', data.height);
						}
						if (this.sticky) {
							this.setFixed(this.sys_scrollTop);
						}
					} else {
						console.log('fixed-' + this._uid + ' data error');
					}
				})
				.exec();
		},
		setFixed(value) {
			if (this.bottom) {
				this.fixed = value >= this.content.bottom - uni.getSystemInfoSync().windowHeight + this.content.height + this.val;
			} else {
				this.fixed = value >= this.content.top - (this.noNav ? this.val : this.val + this.sys_navBar);
			}
		},
		toTop() {
			if (this.clickTo) {
				uni.pageScrollTo({
					scrollTop: this.content.top,
					duration: 100
				});
			}
		}
	}
};
</script>

<style lang="scss">
.ui-fixed {
	.ui-fixed-box {
		position: relative;
		width: 100%;
		&.fixed {
			position: fixed;
		}
		.ui-fixed-content {
			position: relative;
		}
		.ui-fixed-bg {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: 1;
			pointer-events: none;
		}
	}
}
</style>