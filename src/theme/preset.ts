import { definePreset } from '@primeuix/themes';
import { colorScheme, list } from '@primeuix/themes/aura/autocomplete';
import Lara from '@primeuix/themes/lara';

const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    },
    colorScheme: {
      light: {
        content: {
          background: '#fff'
        },
        formField: {
          background: '#f9f9f9',
          borderColor: '#00000000'
        },
        overlay: {
          modal: {
            background: "#fff"
          }
        }
      },
      dark: {
        content: {
          background: '#15171c'
        },
        formField: {
          background: '#1b1c22',
          borderColor: '#00000000'
        },
        overlay: {
          modal: {
            background: "#0d0e12"
          }
        }
      }
    }
  },
  components: {
    datatable: {
      colorScheme: {
        light: {
          headerCell: {
            background: '#fff'
          },
          row: {
            background: '#fff'
          }
        },
        dark: {
          headerCell: {
            background: '#15171c'
          },
          row: {
            background: '#15171c'
          }
        }
      }
    }
  }
});
export default MyPreset; 
