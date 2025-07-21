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
        return httpClient.post('/auth/change-password', passwordData)
    },
    refreshToken: () => {
        return httpClient.post('/auth/refresh-token')
    },
    getUsers: (params = {}) => {
        return httpClient.get('/users', { params })
    },
    getUserById: (id) => {
        return httpClient.get(`/users/${id}`)
    },
    getUserStats: () => {
        return httpClient.get('/users/me/stats')
    },
    getUserActivities: (params = {}) => {
        return httpClient.get('/users/me/activities', { params })
    },
    uploadProfilePhoto: (formData) => {
        return httpClient.post('/users/me/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
})