export class CreateCustomerDto {
    constructor(
        public name: string, 
        public document: string,
        public password: string,
        public phone: string,
    ) {}
}