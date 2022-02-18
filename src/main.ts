interface User {
    id: number;
    firstname: string;
    lastname: string;
    age: number;
    isActive: boolean;
}

const getUserById = (id: number): Promise<User> =>
    new Promise((resolve) => {
        const users: any[] = [
            {
                id: 1,
                firstname: 'Giorgi',
                lastname: 'Bazerashvili',
                age: 26,
                isActive: true,
            },
            {
                id: 2,
                firstname: 'Giorgi',
                lastname: 'Bazerashvili',
                age: 27,
                isActive: false,
            },
            {
                id: 3,
                firstname: 'Giorgi',
                lastname: 'Bazerashvili',
                age: 28,
                isActive: true,
            },
        ];
        setTimeout(() => {
            resolve(users.find((u) => u.id == id));
        }, 3000);
    });




function memo(x: number) {

    return function (_target: any, _methodName: string, descriptor: PropertyDescriptor): any {
        const cache = new Map();
        let originalMethod = descriptor.value;


        descriptor.value = async function (...args: any[]) {
            const key = args[0];
            if (!cache.has(key)) {
                const originalMethodresult = await originalMethod.apply(this, args);
                cache.set(key, { ...originalMethodresult, expired: Date.now() });
                console.log("from original");
                return originalMethod;

            } else if ((Date.now() - cache.get(key).expired) / 1000 / 60 > x) {
                console.log("from original1");
                const originalMethodresult = await originalMethod.apply(this, args);
                cache.set(key, { ...originalMethodresult, expired: Date.now() });
                return originalMethod;
            } else {
                console.log("from cach");
                return cache.get(key);
            }
        };
        return descriptor;
    }
}



class UsersService {
    @memo(1)  // <- Implement This Decorator
    getUserById(id: number): Promise<User> {
        return getUserById(id);
    }
}

const usersService = new UsersService();
const btn = document.getElementById('btn') as HTMLButtonElement;
const input = document.getElementById('userId');
const loading = document.getElementById('loading')!;
btn.addEventListener('click', async () => {
    loading.innerHTML = 'loading';
    await usersService
        .getUserById(+(input as HTMLInputElement).value)
        .then((x) => console.log(x));
    loading.innerHTML = '';
});


