import { createTheme, rem } from '@mantine/core';


export const theme = createTheme({
  /** Put your mantine theme override here */
  colors: {},
  // components: {
  //   Title: Title.extend({
  //     styles: () => ({
  //       root: {
  //         color: 'red',
  //       },
  //     }),
  //   }),
  // },
  defaultRadius: 'md',
  spacing: {
    xxs: rem(4),
    xxl: rem(32),
    gr: rem(56),
  },
  primaryColor: 'pink',
});