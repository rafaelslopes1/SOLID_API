import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersReposiory: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersReposiory = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersReposiory);
  });
  it('should be able to authenticate', async () => {
    await usersReposiory.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersReposiory.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6)
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});