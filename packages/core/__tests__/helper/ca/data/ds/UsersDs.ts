import type {User} from '../../domain/User';

export interface UserDs {
  add(user: User): string;
}
