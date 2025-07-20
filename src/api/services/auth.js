export default (httpClient) => ({
    login: (data) => {
        return httpClient.post('/auth/login', data)
    },
    register: (data) => {
        return httpClient.post('/auth/register', data)
    },
    logout: () => {
        return httpClient.post('/auth/logout')
    },
    getProfile: () => {
        return httpClient.get('/auth/profile')
    },
    updateProfile: (profileData) => {
        return httpClient.put('/auth/profile', profileData)
    },
    changePassword: (passwordData) => {
        return httpClient.put('/auth/change-password', passwordData)
    },
    refreshToken: () => {
        return httpClient.post('/auth/refresh-token')
    },
    getUsers: (params = {}) => {
        return httpClient.get('/users', { params })
    },
    getUserById: (id) => {
        return httpClient.get(`/users/${id}`)
    }
})