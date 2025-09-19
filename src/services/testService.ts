import rawAxios from 'axios';

export interface TestUser {
    id: number
    name: string
    email: string
    address: {
        street: string
        city: string
        suite: string
        zipcode: string
        geo: {
            lat: string
            lng: string
        }
    }
    phone: string
    website: string
    company: {
        name: string
        catchPhrase: string
        bs: string
    }
}

export default {
    getTestUsers: async (): Promise<TestUser[]> => {
        console.log('Fetching test users from public API...');
        const response = await rawAxios.get<TestUser[]>('https://jsonplaceholder.typicode.com/users');
        return response.data;
    }
}