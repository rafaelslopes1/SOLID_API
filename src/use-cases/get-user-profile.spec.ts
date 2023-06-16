import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

let usersReposiory: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersReposiory = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersReposiory);
  });
  it('should be able to get user profile', async () => {
    const createdUser = await usersReposiory.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await sut.execute({
      userId: createdUser.id
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('John Doe');
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});