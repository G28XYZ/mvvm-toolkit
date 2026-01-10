import { MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { servicePrefix } from "./utils";


@Service({ id: `${servicePrefix}:CardVM`, transient: true })
@MakeObservable
export class CardVM extends ViewModel {

}

