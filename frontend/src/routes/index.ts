export const ROUTES = {
  HOME: '/',
  WORKOUTS: '/workouts',
  EXERCISES: '/exercises',

  get NEW_WORKOUT() {
    return `${this.WORKOUTS}/new`;
  },
};
