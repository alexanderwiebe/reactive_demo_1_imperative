import {
  Component,
  inject,
  Injectable,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { datalist, Person } from './data';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  data: BehaviorSubject<Person[]> = new BehaviorSubject([] as Person[]);
  data$ = this.data.asObservable();

  getData() {
    this.data.next(datalist);
    return this.data$;
  }
}

@Component({
  selector: 'app-table-presenter',
  template: `
    <div>Table Presenter Works</div>
    <table>
      <thead>
        <tr>
          <td>name</td>
          <td>height</td>
          <td>age</td>
          <td>department</td>
        <tr>
        <tr>
          <td><input type="text" placeholder="name" (change)="nameChange($event)"/></td>
          <td><input type="text" placeholder="height"/></td>
          <td><input type="text" placeholder="age"/></td>
          <td><input type="text" placeholder="department"/></td>
        <tr>
      </thead>
      <tbody>
        @for( person of filteredPersons; track person.name ) {
          <tr>
            <td>{{ person.name }}</td>
            <td>{{ person.height }}</td>
            <td>{{ person.age }}</td>
            <td>{{ person.department }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class TablePresenterComponent implements OnChanges {
  @Input({ required: true }) persons!: Person[] | null;

  filteredPersons: Person[] = [];

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange['persons'] && this.persons) {
      this.filteredPersons = structuredClone(this.persons);
      // this.sortedPersons = structuredClone(this.persons);
    }
  }

  nameChange(event: Event) {
    const nameFilter = (event.target as HTMLInputElement)?.value;
    this.filteredPersons =
      this.persons?.filter((person) => person.name.includes(nameFilter)) ?? [];
  }
}

@Component({
  selector: 'app-table-container',
  imports: [TablePresenterComponent, AsyncPipe],
  template: `
    <div>Table Container Works</div>
    <app-table-presenter [persons]="data$ | async"/>
  `,
})
export class TableContainerComponent {
  data$ = inject(TableDataService).getData();
}

@Component({
  selector: 'app-root',
  imports: [TableContainerComponent],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <app-table-container />
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
