import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;
describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  })
  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia MGold',
      description: null,
      phone: null,
      latitude: -1.458051484580051,
      longitude: -48.498437301447474
    });

    expect(gym.id).toEqual(expect.any(String));
  });
})