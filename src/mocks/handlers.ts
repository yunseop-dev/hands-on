import { http, delay, HttpResponse, type JsonBodyType } from 'msw'
import random from '../lib/random'
import type { LoginResponse, LoginVariables } from '../types';

// Mock Data
export const loginResponse: LoginResponse = {
    "id": 1,
    "username": "emilys",
    "email": "emily.johnson@x.dummyjson.com",
    "firstName": "Emily",
    "lastName": "Johnson",
    "gender": "female",
    "image": "https://dummyjson.com/icon/emilys/128",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvSmVhbm5lLnBuZz9zZXQ9c2V0NCIsImlhdCI6MTcxMTIwOTAwMSwiZXhwIjoxNzExMjEyNjAxfQ.F_ZCpi2qdv97grmWiT3h7HcT1prRJasQXjUR4Nk1yo8"
}

const login: Parameters<typeof http.post>[1] = async (info) => {
    const body = await info.request.json() as LoginVariables
    const invaildError = HttpResponse.json({
        message: 'invalid value',
    }, {
        status: 400,
    })

    if (body == null) {
        await delay(300)
        return invaildError;
    }
    return randomResponseNotifier(
        [
            { response: loginResponse, status: 200 }
        ],
        [
            // { response: { message: 'server error' }, status: 500 }
        ]
    )
};


const randomResponseNotifier = async <
    T extends JsonBodyType,
    U extends JsonBodyType
>(
    successResponses: {
        response: T;
        status: number;
        headers?: Headers;
    }[],
    failedResponses: {
        response: U;
        status: number;
    }[]
) => {
    const responseList = [
        ...successResponses.map(item => HttpResponse.json(item.response, {
            status: item.status
        })),
        ...failedResponses.map(item => HttpResponse.json(item.response, {
            status: item.status
        }))
    ];
    const len = responseList.length;
    const randomNumber = random(len - 1);
    await delay(random(300, 500));
    return responseList[randomNumber]
}


export const handlers = [
    http.post('/auth/login', login),
]
