export class UserData {
    userId?: string | null;
    userName?: string | null;
    userEmail?: string | null;
    userAvatar?: string | null;
    userIsAdmin: Boolean = false;
    socialId?: string | null;
    userIsLoggedIn: Boolean = false;
    token?: string | null;
    refreshToken?: string | null;
    tokenExpiryDate?: string | null;

    constructor(init?: Partial<UserData>) {
        Object.assign(this, init);
    }

    toPlainObject() {
        return {
            userId: this.userId,
            userName: this.userName,
            userEmail: this.userEmail,
            userAvatar: this.userAvatar,
            userIsAdmin: this.userIsAdmin,
            socialId: this.socialId,
            userIsLoggedIn: this.userIsLoggedIn,
            token: this.token,
            refreshToken: this.refreshToken,
            tokenExpiryDate: this.tokenExpiryDate
        };
    }
}