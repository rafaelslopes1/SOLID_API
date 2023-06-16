import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.create({
      id: 'gym-01',
      title: 'Academia Lugar Nenhum',
      description: 'Descrição da Lugar Nenhum',
      phone: '',
      latitude: -1.4598722207269719,
      longitude: -48.49658025304682
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4598722207269719,
      userLongitude: -48.49658025304682
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('shoud not be able to check in twice in te same day', async () => {
    vi.setSystemTime(new Date(2023, 5, 15, 18, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4598722207269719,
      userLongitude: -48.49658025304682
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -1.4598722207269719,
        userLongitude: -48.49658025304682
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('shoud be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 5, 15, 18, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4598722207269719,
      userLongitude: -48.49658025304682
    });

    vi.setSystemTime(new Date(2023, 5, 16, 18, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4598722207269719,
      userLongitude: -48.49658025304682
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: 'gym-02',
      title: 'Academia MGold',
      description: 'Descrição da Academia MGold',
      phone: '',
      latitude: -1.458051484580051,
      longitude: -48.498437301447474
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -1.4598722207269719,
        userLongitude: -48.49658025304682
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});