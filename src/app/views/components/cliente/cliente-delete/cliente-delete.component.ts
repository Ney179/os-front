import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {
  id_cli = '';

  cliente: Cliente = {
    id:'',
    nome: '',
    cpf: '',
    telefone: ''
  };

constructor(private router: Router,
  private service: ClienteService,
  private route : ActivatedRoute) { }

ngOnInit(): void {
  this.id_cli = this.route.snapshot.paramMap.get('id')!;
  this.findById();
}

update(): void {
  this.service.update(this.cliente).subscribe((resposta) =>{
    this.router.navigate(['clientes'])
    this.service.message('Técnico atualizado com sucesso!')
  }, err =>{
    if(err.error.error.match('já cadastrado')){
      this.service.message(err.error.error)
    }else if(err.error.errors[0].message === "invalid Brazilian individual taxpayer registry number (CPF)"){
      this.service.message("CPF invalido!");
      console.log(err);
    }
  })
}

  findById(): void {
    this.service.findById(this.id_cli).subscribe(resposta =>{
      this.cliente = resposta;
    })
  }

  delete(): void {
    this.service.delete(this.id_cli).subscribe(resposta =>{
      this.router.navigate(['clientes']);
      this.service.message('Cliente deletado com sucesso!');
    }, err => {
      if(err.error.error.match('possui ordens de serviços')){
        this.service.message(err.error.error);
      }
    })
  }

  cancel(): void {
    this.router.navigate(['clientes'])
  }
}