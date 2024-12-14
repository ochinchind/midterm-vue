// ~/mixins/favMixin.ts
import { ref } from 'vue';
import { notifyUser } from '~/scripts/notifications';

export default {
  data() {
    return {
      productDetails: ref([]), // Manage the list of favorite products
    };
  },

  methods: {
    fetchProductDetails() {
      const rawFavoritesData = localStorage.getItem('favs');
      if (rawFavoritesData) {
        const parsedFavorites = JSON.parse(rawFavoritesData);

        this.productDetails = parsedFavorites.map((item: any) => ({
          id: item.id,
          product_id: item.id,
          name: item.name,
          price: item.price || 0,
          description: item.description,
          rating: item.rating,
          image_url: item.image_url ?? item.photos[0],
          category_name: item.category_name,
          photos: item.photos,
          reviews: item.reviews,
          isInCart: item.isInCart,
          isInFavorites: item.isInFavorites,
        }));
      } else {
        this.productDetails = [];
      }
    },

    saveFavoritesToLocalStorage() {
      try {
        localStorage.setItem('favs', JSON.stringify(this.productDetails));
      } catch (error) {
        console.error('Error saving favorites:', error);
        notifyUser('Failed to save favorites', 'danger');
      }
    },

    removeFromFavorites(item: any) {
      try {
        this.productDetails = this.productDetails.filter(
          (favorite: any) => favorite.id !== item.id
        );
        this.saveFavoritesToLocalStorage();
        notifyUser('Item removed from favorites', 'success');
      } catch (error) {
        console.error('Error removing item:', error);
        notifyUser('Failed to remove item', 'danger');
      }
    },
  },

  mounted() {
    this.fetchProductDetails();
  },
};