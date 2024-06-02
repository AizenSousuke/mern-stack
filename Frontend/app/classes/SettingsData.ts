export class SettingsData {
    goingOut: string[] | undefined;
    goingHome: string[] | undefined;
    theme: ThemeData = new ThemeData;
    dateUpdated: string | undefined;
}

export class ThemeData {
    darkMode: boolean = false;
}