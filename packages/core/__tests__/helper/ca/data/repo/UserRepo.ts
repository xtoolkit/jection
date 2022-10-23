import type {User} from '../../domain/User';
import {LocalUserDs} from '../../local/ds/LocalUserDs';
import {RemoteUserDs} from '../../remote/ds/RemoteUserDs';

export class UserRepo {
  constructor(
    private localUserDs: LocalUserDs,
    private remoteUserDs: RemoteUserDs
  ) {}

  get getLocalUserDs() {
    return this.localUserDs;
  }
  get getRemoteUserDs() {
    return this.remoteUserDs;
  }

  add(user: User) {
    this.localUserDs.add(user);
    this.remoteUserDs.add(user);
    return user;
  }
}
