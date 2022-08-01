import { Car } from "./Car"
import { MiniTruck } from "./MiniTruck"
import { Van } from "./Van"
import { Truck } from "./Truck"
import { Bus } from "./Bus"
import { Vehicle } from "./Vehicle"
export { Vehicle }

export const vehicles: typeof Vehicle[] = [Car, MiniTruck, Van, Truck, Bus]
