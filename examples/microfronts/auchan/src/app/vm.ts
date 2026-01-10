import { MakeObservable, Service, ViewModel } from 'rvm-toolkit';
import { servicePrefix } from './utils';

@Service({ id: `${servicePrefix}:MainVM` })
@MakeObservable
export class AuchanMainVM extends ViewModel {

}