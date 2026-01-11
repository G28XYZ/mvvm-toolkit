import { MakeObservable, Service, ViewModel } from "rvm-toolkit";

@Service({ id: 'microfrontHost:AppVM' })
@MakeObservable
export class AppVM extends ViewModel {

}