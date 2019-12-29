import app, {MONGO_URI, SCHEMA_TEST_NAME, TEST_ENV} from "../src/app";
import * as mongoose from 'mongoose'
import {ICreateUserDto, IUser, User} from "../src/models/User";
import * as request from "supertest";
import {Response} from "superagent";
import {IAuthenticationResponse, ILogin} from "../src/interfaces/miscInterfaces";

const user: ICreateUserDto = {
    username: 'user',
    password: 'user123',
    email: 'test@email.com',
    name: 'User'
};

process.env.NODE_ENV = TEST_ENV;

beforeAll(async () => {

    let uri = `${MONGO_URI}/${SCHEMA_TEST_NAME}`;
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
});

beforeEach(async () => {
    await deleteAllUsers();
});

afterEach(async () => {
    await deleteAllUsers();
});

describe("Server Online", () => {
    it("Ping Server", async () => {
        const result = await request(app).get("/ping");
        expect(result.text).toEqual("pong");
        expect(result.status).toEqual(200);
    });
});

describe("Authentication", () => {
    it("Create Account", async () => {
        let response = await signup();
        expect(response.status).toEqual(200);
        let body = response.body as IAuthenticationResponse;
        expect(body.user).not.toBeNull();
        expect(body.token).not.toBeNull();
    });

    it("Login", async () => {
        let response = await signup();
        expect(response.status).toEqual(200);
        response = await login();
        let body = response.body as IAuthenticationResponse;
        expect(response.status).toEqual(200);
        expect(body.user).not.toBeNull();
        expect(body.token).not.toBeNull();
    });
});

describe("User", () => {
    it("GET / ME", async () => {
        let token = await getToken();
        const result = await request(app)
            .get("/api/v1/user/me")
            .set('Authorization', 'Bearer ' + token);
        let body = result.body as IUser;
        expect(result.status).toEqual(200);
        expect(body).not.toBeNull();
        expect(body.username).toEqual(user.username);
    });
});

async function getToken(): Promise<string> {
    let response = await signup();
    expect(response.status).toEqual(200);
    response = await login();
    let body = response.body as IAuthenticationResponse;

    return body.token;
}

async function signup(): Promise<Response> {
    return request(app)
        .post("/api/v1/authentication/signup")
        .send(user);
}

async function login(): Promise<Response> {
    let iLogin: ILogin = {
        username: user.username,
        password: user.password
    };
    return request(app)
        .post("/api/v1/authentication/login")
        .send(iLogin);
}

async function deleteAllUsers() {
    try {
        await User.deleteMany({});
    } catch (error) {
        console.error(error);
    }
}
