export interface IBusStopSlice {
    GoingOut: { [BusStopCode: number]: ISavedBusStopBuses };
    GoingHome: { [BusStopCode: number]: ISavedBusStopBuses };
}

export interface ISavedBusStopBuses {
    BusesTracked: number[];
}