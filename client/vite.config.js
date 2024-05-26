import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  //creating a server
  server:{
    //crreating a proxy
    proxy:{
      //when api/ path is given following path is added to the begining
      '/api':{
        target:'http://localhost:3000',
        secure:false,
      },
    },

  },

  plugins: [react()],
});
