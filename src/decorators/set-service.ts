import { Service, ServiceOptions } from 'typedi';
import { state } from '../store';

export const SetService = (serviceOptions?: ServiceOptions<unknown>) => (base: new (...args: any[]) => any) =>
  Service(serviceOptions)(
    class extends base {
      constructor(...args: any[]) {
        super(...args);
        if (args.length && args[0].services) {
          state.storeServices = args[0].services;
        }
      }
    }
  );
