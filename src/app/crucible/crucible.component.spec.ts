import {anything, instance, mock, when} from 'ts-mockito';
import {of} from 'rxjs';
import {CrucibleComponent} from './crucible.component';
import {BungieService} from '../core/bungie.service';
import {CrucibleService} from './crucible.service';

describe('CrucibleComponent', () => {
  let component: CrucibleComponent;
  const bungieServiceMock = mock(BungieService);
  const crucibleServiceMock = mock(CrucibleService);

  beforeEach(() => {
    when(bungieServiceMock.searchUser(anything())).thenReturn(of([]));
    component = new CrucibleComponent(instance(bungieServiceMock), instance(crucibleServiceMock));
  });

  test('should instantiate', () => {
    expect(component).toBeTruthy();
  });
});
