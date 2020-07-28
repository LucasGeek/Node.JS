import { Injectable } from "@nestjs/common";
import { Flunt } from "src/utils/flunt";
import { Contract } from "./contract";
import { Customer } from "../models/customer.model";

@Injectable()
export class CreateCustomerContract implements Contract {
    errors: any[];

    isValid(): boolean {
        return this.errors.length === 0;
    }

    validate(model: Customer): boolean {
        const flunt = new Flunt();

        flunt.hasMinLen(model.name, 5, 'Nome inválido');
        flunt.isEmail(model.email, 'E-mail inválido');
        flunt.isFixedLen(model.document, 11, 'CPF inválido');
        flunt.isFixedLen(model.phone, 11, 'Celular inválido');
        
        flunt.hasMinLen(model.pets, 1, 'Adicione pelo menos um pet');
        model.pets.forEach((element, index, array) => {
            flunt.hasMinLen(element.name, 2, 'Nome do pet inválido => (' + element.name + ')');
            flunt.hasMinLen(element.gender, 4, 'Gênero do pet inválido => (' + element.name + ')');
            flunt.isRequired(element.kind, 'Tipo do animal inválido => (' + element.name + ')');
            flunt.isRequired(element.brand, 'Raça do pet inválida => (' + element.name + ')');
        })

        flunt.isFixedLen(model.billingAddress.zipCode, 8, 'CEP de cobrança inválido');
        flunt.isRequired(model.billingAddress.street, 'Rua de cobrança inválido');
        flunt.isRequired(model.billingAddress.number, 'Número residencial de cobrança inválido');
        flunt.isRequired(model.billingAddress.neighborhood, 'Bairro de cobrança inválido');
        flunt.isRequired(model.billingAddress.city, 'Cidade de cobrança inválido');
        flunt.hasMinLen(model.billingAddress.state, 2, 'Estado de cobrança inválido');
        flunt.hasMinLen(model.billingAddress.country, 2, 'Pais de cobrança inválido');

        flunt.isFixedLen(model.shippingAddress.zipCode, 8, 'CEP de compra inválido');
        flunt.isRequired(model.shippingAddress.street, 'Rua de compra inválido');
        flunt.isRequired(model.shippingAddress.number, 'Número residencial de compra inválido');
        flunt.isRequired(model.shippingAddress.neighborhood, 'Bairro de compra inválido');
        flunt.isRequired(model.shippingAddress.city, 'Cidade de compra inválido');
        flunt.hasMinLen(model.shippingAddress.state, 2, 'Estado de compra inválido');
        flunt.hasMinLen(model.shippingAddress.country, 2, 'Pais de compra inválido');

        flunt.isRequired(model.creditCard.holder, 'Nome do cartão inválido');
        flunt.isFixedLen(model.creditCard.expiration, 4, 'Data de experição do cartão inválido');
        flunt.isFixedLen(model.creditCard.number, 16,'Número de cartão inválido');

        this.errors = flunt.errors;

        return this.isValid(); 
    }
}