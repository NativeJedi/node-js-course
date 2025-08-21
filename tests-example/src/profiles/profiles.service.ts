import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { AppLogger } from '../logger/logger.service';

@Injectable()
class ProfilesService {
  profiles: Profile[] = [];

  constructor(private readonly logger: AppLogger) {}

  findAll() {
    return this.profiles;
  }

  findById(id: Profile['id']) {
    const profile = this.profiles.find((profile) => profile.id === id);

    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found.`);
    }

    return profile;
  }

  findByEmail(email: Profile['email']) {
    return this.profiles.find((profile) => profile.email === email);
  }

  create(dto: CreateProfileDto) {
    const existedProfile = this.findByEmail(dto.email);

    if (existedProfile) {
      throw new BadRequestException(
        `Profile with email ${dto.email} already exists.`,
      );
    }

    const profile = {
      ...dto,
      id: Date.now().toString(),
    };

    this.profiles.push(profile);

    this.logger.log('Profile created', {
      email: profile.email,
      id: profile.id,
    });

    return profile;
  }
}

export { ProfilesService };
