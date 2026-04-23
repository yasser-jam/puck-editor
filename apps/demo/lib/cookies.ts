import Cookies from "js-cookie";

export const getCookie = (name: string) => {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(name);
};

export const addCookie = (name: string, value: string) => {
  if (typeof window === "undefined") return;
  Cookies.set(name, value);
};

export const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;
  Cookies.remove(name);
};