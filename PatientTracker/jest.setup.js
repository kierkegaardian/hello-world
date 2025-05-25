const { BackHandler } = require('react-native');
BackHandler.addEventListener = jest.fn(() => ({ remove: jest.fn() }));
BackHandler.removeEventListener = jest.fn();
