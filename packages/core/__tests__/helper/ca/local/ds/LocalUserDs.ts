import type {UserDs} from '../../data/ds/UsersDs';
import type {User} from '../../domain/User';

export class LocalUserDs implements UserDs {
  add(user: User): string {
    return user.name;
  }
}
