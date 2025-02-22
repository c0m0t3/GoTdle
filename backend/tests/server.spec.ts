import * as http from 'http';
import { Server } from '../src/server';
import { App } from '../src/app';
import { EnvType } from '../src/config/env.config';

describe('Server', () => {
  let mockApp: App;
  let mockConfig: EnvType;
  let serverInstance: Server;

  beforeEach(() => {
    mockApp = {
      listen: jest.fn((_port: number, callback: () => void) => {
        callback();
        return {
          close: jest.fn((callback?: () => void) => {
            if (callback) {
              callback();
            }
          }),
        } as unknown as http.Server;
      }),
    } as unknown as App;

    mockConfig = {
      PORT: 3000,
    } as EnvType;

    serverInstance = new Server(mockApp, mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('start', () => {
    it('should start the server and listen on the specified port', async () => {
      const consoleSpy = jest.spyOn(console, 'info');

      await serverInstance.start();

      expect(mockApp.listen).toHaveBeenCalledWith(mockConfig.PORT, expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith(`Listening to port ${mockConfig.PORT}`);
    });

    it('should handle unexpected errors', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit called with code: ${code}`);
        });
      
        const error = new Error('Unexpected error');
      
        expect(() => {
          process.emit('uncaughtException', error);
        }).toThrow(`process.exit called with code: 1`);
      
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
        expect(processExitSpy).toHaveBeenCalledWith(1);
      });

    it('should handle SIGTERM signal', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info');
      const serverCloseSpy = jest.fn();

      const mockServer = {
        close: serverCloseSpy,
      } as unknown as http.Server;

      serverInstance['_handleSigterm'](mockServer);

      process.emit('SIGTERM');

      expect(consoleInfoSpy).toHaveBeenCalledWith('SIGTERM received');
      expect(serverCloseSpy).toHaveBeenCalled();
    });
  });

  describe('_handleExit', () => {
    it('should close the server and exit the process', () => {
        const serverCloseSpy = jest.fn((callback?: () => void) => {
          if (callback) {
            callback();
          }
        });
        const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit called with code: ${code}`);
        });
      
        const mockServer = {
          close: serverCloseSpy,
        } as unknown as http.Server;
      
        expect(() => {
          serverInstance['_handleExit'](mockServer);
        }).toThrow(`process.exit called with code: 1`);
      
        expect(serverCloseSpy).toHaveBeenCalled();
        expect(processExitSpy).toHaveBeenCalledWith(1);
      });      

      it('should exit the process if server is not provided', () => {
        const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit called with code: ${code}`);
        });
      
        try {
          serverInstance['_handleExit'](null as unknown as http.Server);
        } catch (_error) {
          // Fehler abfangen, damit der Test nicht abbricht
        }
      
        expect(processExitSpy).toHaveBeenCalledWith(1);
        processExitSpy.mockRestore();
      });
      
  });
});