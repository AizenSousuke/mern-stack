/**
 * Sample interface for prisma user model
 */
export default interface User {
    id: String
    name: String
    socialId: String
    email: String
    password: String
    avatar: String
    isAdmin: Boolean
    token: String
    refreshToken: String
    tokenExpiryDate: Date
    createdAt: Date
    updatedAt: Date

    settingId: String
    Setting: any
}