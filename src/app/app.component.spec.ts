import { AppComponent } from './app.component';
import {anything, instance, mock, when} from 'ts-mockito';
import {BungieService} from './core/bungie.service';
import {CrucibleService} from './crucible/crucible.service';
import {of} from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  const bungieServiceMock = mock(BungieService);
  const crucibleServiceMock = mock(CrucibleService);

  beforeEach(() => {
    when(bungieServiceMock.searchUser(anything())).thenReturn(of([]));
    component = new AppComponent(instance(bungieServiceMock), instance(crucibleServiceMock));
  });

  test('should instantiate', () => {
    expect(component).toBeTruthy();
  });
});
