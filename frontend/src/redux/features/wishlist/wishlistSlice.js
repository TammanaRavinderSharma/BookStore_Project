import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialState = {
  wishlistItems: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const book = action.payload;
      const index = state.wishlistItems.findIndex((item) => item._id === book._id);

      if (index === -1) {
        // Add to wishlist
        state.wishlistItems.push(book);
        localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Added to favorites! ❤️",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e293b",
          color: "#fff",
          iconColor: "#ef4444",
        });
      } else {
        // Remove from wishlist
        state.wishlistItems.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));

        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Removed from favorites",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e293b",
          color: "#fff",
          iconColor: "#38bdf8",
        });
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(item => item._id !== action.payload._id);
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));
    }
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
