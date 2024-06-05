export const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Main.vue"),
  },
  {
    path: '/query',
    name: 'Query',
    component: () => import('@/pages/Query.vue')
  {
    path: '/book',
    name: 'WordsBook',
    component: () => import('@/pages/WordsBook.vue')
  },
  }
];
