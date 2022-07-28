import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';


import { ChakraProvider } from '@chakra-ui/react';

import App from './app';


ReactDOM.render(<ChakraProvider><App/></ChakraProvider>, document.getElementById('app'));
