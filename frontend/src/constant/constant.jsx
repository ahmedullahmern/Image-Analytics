const devUrl = "http://localhost:3000"
const proudUrl = "https://beneficary-backend.vercel.app/"

export const Base_Url = devUrl

export const AppRoutes = {
    signup: Base_Url + "/api/auth/register",
    login: Base_Url + "/api/auth/login",
    getMyInfo: Base_Url + "/api/auth/myInfo",
    uploadImage: Base_Url + "/api/images/upload",
    getImages: Base_Url + "/api/images",
    analyticsCount: Base_Url + "/api/analytics/count",
    analyticsByDate: Base_Url + "/api/analytics/bydate",
    analyticsByLabel: Base_Url + "/api/analytics/bylabel",
    analyticsFilter: Base_Url + "/api/analytics/filterbydate",
}