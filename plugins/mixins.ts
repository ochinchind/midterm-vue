import favMixin from '~/mixins/favMixin';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.mixin(favMixin);
  });