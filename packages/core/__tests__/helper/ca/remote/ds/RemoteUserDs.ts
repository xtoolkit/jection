import type {UserDs} from '../../data/ds/UsersDs';
import type {User} from '../../domain/User';

export class RemoteUserDs implements UserDs {
  add(user: User): string {
    return 'RemoteUserDs.add';
  }
}
