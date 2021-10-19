import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { error } from 'console';
import { PaisesService } from './servicies/paises/paises.service';
import { PersonaService } from './servicies/persona/persona.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public formPersona!: FormGroup;
  public paises: any;
  public personas: any;
  public seleccionado: any;

  constructor(
    //public formGroup: FormGroup,
    public fb: FormBuilder,
    public paisService: PaisesService,
    public personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.paisService.getAllPaises().subscribe(
      (resp) => {
        this.paises = resp;
        console.log(resp);
      },
      (error) => {
        console.error(error);
      }
    );

    this.personaService.getAllPersonas().subscribe(
      (resp) => {
        this.personas = resp;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  buildForm() {
    this.formPersona = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      pais: ['', Validators.required],
    });
  }

  guardar(): void {
    this.personaService.savePersona(this.formPersona.value).subscribe(
      (resp) => {
        this.formPersona.reset();
        this.personas = this.personas.filter(
          (persona: { id: any }) => resp.id != persona.id
        );
        this.personas.push(resp);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminar(persona: { id: string }) {
    this.personaService.deletePersonaId(persona.id).subscribe(
      (resp) => {
        console.log(resp);
        if (resp == true) {
          this.personas.pop(persona);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editar(persona: {
    id: any;
    nombre: any;
    apellido: any;
    edad: any;
    pais: any;
  }) {
    this.formPersona.setValue({
      id: persona.id,
      nombre: persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad,
      pais: persona.pais,
    });

    this.seleccionado = persona.pais;
    console.log(this.seleccionado);
    this.compareByOptionId(this.paises, this.seleccionado);
  }
  /* Return true or false if it is the selected */
  compareByOptionId(idFist: { id: any }, idSecond: { id: any }) {
    return idFist && idSecond && idFist.id == idSecond.id;
  }
}
