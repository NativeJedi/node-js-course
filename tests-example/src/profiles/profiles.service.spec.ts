import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { loggerMock } from '../../test/mocks/logger';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProfilesService(loggerMock);
  });

  it('should create a profile and return it', () => {
    const createProfileDto: CreateProfileDto = {
      displayName: 'John Doe',
      age: 30,
      email: 'test@mail.com',
    };

    const profile = service.create(createProfileDto);

    expect(profile).toEqual(
      expect.objectContaining({
        ...createProfileDto,
        id: expect.stringMatching(/^\d+$/),
      }),
    );
  });

  it('should throw an error when creating a profile with an existing email', () => {
    const profile1: CreateProfileDto = {
      displayName: 'Jane Doe',
      age: 25,
      email: 'test1@email.com',
    };

    const profile2: CreateProfileDto = {
      displayName: 'Jane Doe',
      email: 'test1@email.com',
    };

    const profile = service.create(profile1);

    expect(profile).toMatchObject(profile1);

    expect(() => service.create(profile2)).toThrow(
      `Profile with email ${profile2.email} already exists.`,
    );
  });

  it('should log creation of a profile', () => {
    const createProfileDto: CreateProfileDto = {
      displayName: 'Alice',
      age: 28,
      email: 'test@email.com',
    };

    const profile = service.create(createProfileDto);

    expect(loggerMock.log).toHaveBeenCalledWith('Profile created', {
      email: profile.email,
      id: profile.id,
    });
  });

  describe('findById', () => {
    it('should return a profile by id', () => {
      const createProfileDto: CreateProfileDto = {
        displayName: 'Alice',
        age: 28,
        email: 'email@test.com',
      };

      const profile = service.create(createProfileDto);

      const foundProfile = service.findById(profile.id);
      expect(foundProfile).toEqual(profile);
    });

    it('should throw an error when profile not found by id', () => {
      const id = '1234';

      expect(() => service.findById(id)).toThrow(
        `Profile with id ${id} not found.`,
      );
    });
  });
});
