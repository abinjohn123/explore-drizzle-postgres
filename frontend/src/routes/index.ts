export const ROUTES = {
  AUTH: '/auth',
  HOME: '/',
  WORKOUTS: '/workouts',
  EXERCISES: '/exercises',
  PROFILE: '/profile',

  get NEW_WORKOUT() {
    return `${this.WORKOUTS}/new`;
  },
};
