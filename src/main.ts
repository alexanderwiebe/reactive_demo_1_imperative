import {
  Component,
  inject,
  Injectable,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AsyncPipe } from "@angular/common";
import { bootstrapApplication } from "@angular/platform-browser";
import { BehaviorSubject, Observable } from "rxjs";
import { datalist, Person, PersonForm } from "./data";

@Injectable({
  providedIn: "root",
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
  selector: "app-table-presenter",
  imports: [ReactiveFormsModule],
  template: `
    <div>Table Presenter Works</div>
    <table>
      <thead>
        <tr>
          <td></td>
          <td>name</td>
          <td>height</td>
          <td>age</td>
          <td>department</td>
        </tr>

        <tr></tr>
        <tr>
          <td>Filters</td>
          <td>
            <input
              type="text"
              placeholder="name"
              (keyup)="nameChange($event)"
            />
          </td>
          <!-- <td><input type="text" placeholder="height"/></td>
          <td><input type="text" placeholder="age"/></td>
          <td><input type="text" placeholder="department"/></td> -->
        </tr>

        <tr></tr>
      </thead>

      <tbody>
        @for( person of filteredPersons; track person.name ) {
        <tr>
          <td></td>
          <td>{{ person.name }}</td>
          <td>{{ person.height }}</td>
          <td>{{ person.age }}</td>
          <td>{{ person.department }}</td>
        </tr>
        }
        <tr [formGroup]="personForm">
          <td>Add User</td>
          <td><input formControlName="name" type="text" placeholder="name" /></td>
          <td><input formControlName="height" type="number" placeholder="height" /></td>
          <td><input formControlName="age" type="number" placeholder="age" /></td>
          <td>
            <select id="department" formControlName="department">
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </td>
          <td><button (click)="addUser($event)">Add</button></td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TablePresenterComponent implements OnChanges {
  @Input({ required: true }) persons!: Person[] | null;

  filteredPersons: Person[] = [];

  fb = inject(FormBuilder);
  personForm: FormGroup = this.fb.nonNullable.group<PersonForm>({
    name: this.fb.nonNullable.control("", Validators.required),
    height: this.fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
    ]),
    age: this.fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
    ]),
    department: this.fb.nonNullable.control("Engineering", Validators.required),
  });

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange["persons"] && this.persons) {
      this.filteredPersons = structuredClone(this.persons);
    }
  }

  nameChange(event: Event) {
    const nameFilter = (event.target as HTMLInputElement)?.value; // should this be stored locally?
    this.filteredPersons =
      this.persons?.filter((person) => person.name.toLowerCase().includes(nameFilter.toLowerCase())) ?? [];
  }

  addUser(event$: Event) {
    if(this.personForm.valid) {
      this.persons?.push(this.personForm.value);
      // see the problem? I have to try and get the value of the name filter... 
      // this.filteredPersons = this.persons?.filter((person) => person.name.toLowerCase().includes(nameFilter.toLowerCase())) ?? [];
      this.personForm.reset();
    }
  }
}

@Component({
  selector: "app-table-container",
  imports: [TablePresenterComponent, AsyncPipe],
  template: `
    <div>Table Container Works</div>
    <app-table-presenter [persons]="data$ | async" />
  `,
})
export class TableContainerComponent {
  data$ = inject(TableDataService).getData();
}

@Component({
  selector: "app-root",
  imports: [TableContainerComponent],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <app-table-container />
  `,
})
export class App {
  name = "Angular";
}

bootstrapApplication(App);
