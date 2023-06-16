import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;
describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -1.458051484580051,
      longitude: -48.498437301447474
    });

    await gymsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -1.458051484580051,
      longitude: -48.498437301447474
    });

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
    ]);
  });

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Typescript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -1.458051484580051,
        longitude: -48.498437301447474
      });
    }

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Gym 21' }),
      expect.objectContaining({ title: 'Typescript Gym 22' }),
    ]);
  });
});