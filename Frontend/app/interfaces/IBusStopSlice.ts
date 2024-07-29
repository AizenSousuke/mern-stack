export interface IBusStopSlice {
    GoingOut: { [key: number]: ISavedBusStopBuses };
    GoingHome: { [key: number]: ISavedBusStopBuses };
}

export interface ISavedBusStopBuses {
    Buses: { [key: number]: number };
}