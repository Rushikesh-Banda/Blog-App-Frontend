import { create } from "zustand";
import API from "../api/axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;
    console.log(role); // added line to use role

    try {
      //set loading true
      set({ loading: true, error: null });

      //make api call
      const res = await API.post("/user-api/login", userCredObj);

      console.log("login response:", res.data); // added debug

      //update state
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });

    } catch (err) {
      console.log("err is ", err);

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      //set loading state
      set({ loading: true, error: null });

      //make logout api req
      await API.get("/user-api/articles");

      //update state
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },

  // restore login
   checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await API.get("/user-api/articles");

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  },
}));