
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  
  Titulo = 'Productos';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el Listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Producto[] = null;
  RegistrosTotal: number;



  Pagina = 1; // inicia pagina 1

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' }
  ];

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;
  submitted = false;
  


  constructor(
    public formBuilder: FormBuilder,
    private productosService:ProductosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
   
    this.FormRegistro = this.formBuilder.group({
      ProductoID: [0],
      ProductoNombre: [
        "",
        [Validators.required, Validators.maxLength(50)]
      ],

      ProductoFechaAlta: [
        "",
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      ProductoStock: [ null,[Validators.required]],
      
    });

  
  }



  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset();
    this.submitted = false;
    
    this.FormRegistro.markAsUntouched(); // incluido en el reset
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    this.productosService
      .get()
      .subscribe((res: any) => {
        this.Items = res;
        
      });
  }


  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.ProductoFechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProductoFechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == "A" ||itemCopy.ProductoID==0||itemCopy.ProductoId==null) {
      itemCopy.ProductoID=0;
      this.productosService
      .post(itemCopy)
      .subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      
    }
  }
 
  // Volver/Cancelar desde Agregar/Modificar/Consultar
  Volver() {
    this.AccionABMC = 'L';
    this.Buscar();
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }

}






